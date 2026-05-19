'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { Edit2, Sparkles } from 'lucide-react';

interface VisualEditorContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isUserAdmin: boolean;
  saveBlock: (params: { page: string; section: string; key: string; value: string; type?: string }) => Promise<any>;
  isSaving: boolean;
}

const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined);

export const VisualEditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Check admin session using the /api/auth/me endpoint
  const { data: authData } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return { authenticated: false };
        return await res.json();
      } catch (e) {
        return { authenticated: false };
      }
    },
    staleTime: 60 * 1000, // cache for 1 minute
  });

  const isUserAdmin = authData?.authenticated === true;

  // Turn off edit mode automatically if we leave the site or enter admin dashboard
  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setIsEditMode(false);
    }
  }, [pathname]);

  // Mutation to upsert CMS contents in real-time
  const { mutateAsync: saveCMSBlock, isPending: isSaving } = useMutation({
    mutationFn: async ({ page, section, key, value, type }: { page: string; section: string; key: string; value: string; type?: string }) => {
      const res = await fetch('/api/cms/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, key, value, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo guardar el bloque.');
      }
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both local and general CMS cache
      queryClient.invalidateQueries({ queryKey: ['cms', variables.page] });
      queryClient.invalidateQueries({ queryKey: ['admin-cms', variables.page] });
      toast.success('¡Bloque actualizado en tiempo real! ⚡', {
        id: `save-${variables.page}-${variables.key}`,
      });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al guardar los cambios en caliente.');
    }
  });

  const saveBlock = async (params: { page: string; section: string; key: string; value: string; type?: string }) => {
    return saveCMSBlock(params);
  };

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        isUserAdmin,
        saveBlock,
        isSaving,
      }}
    >
      {children}
      {isUserAdmin && !pathname.startsWith('/admin') && <VisualEditorFloatingPanel />}
    </VisualEditorContext.Provider>
  );
};

export const useVisualEditor = () => {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error('useVisualEditor must be used within a VisualEditorProvider');
  }
  return context;
};

// Premium Floating Action Bar for Visual Editing
const VisualEditorFloatingPanel = () => {
  const { isEditMode, setIsEditMode, isSaving } = useVisualEditor();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] font-sans">
      <div className={`
        flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-500 border backdrop-blur-xl
        ${isEditMode 
          ? 'bg-amber-950/80 border-amber-500/30 text-amber-100 shadow-amber-950/20' 
          : 'bg-zinc-950/85 border-zinc-800/80 text-zinc-200 shadow-black/40'}
      `}>
        {/* Glowing Indicator dot */}
        <div className="relative flex h-3.5 w-3.5 items-center justify-center">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEditMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isEditMode ? 'bg-amber-400' : 'bg-emerald-500'}`} />
        </div>

        {/* Text Details */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Visual Core Engine
          </span>
          <span className="text-xs font-bold whitespace-nowrap">
            {isEditMode ? 'Editando contenido en vivo' : 'Administrador Conectado'}
          </span>
        </div>

        {/* Vertical divider */}
        <div className="h-8 w-px bg-zinc-800" />

        {/* Action Toggle Switch */}
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
            if (!isEditMode) {
              toast('Haz clic en cualquier texto o pon el cursor sobre las imágenes para editarlas.', {
                icon: '✏️',
                duration: 5000,
              });
            } else {
              toast.success('Modo edición desactivado.');
            }
          }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 transform active:scale-95 shadow-md
            ${isEditMode 
              ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 hover:shadow-lg hover:shadow-amber-500/10' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-white'}
          `}
        >
          <Edit2 className="w-3.5 h-3.5" />
          {isEditMode ? 'Desactivar Edición' : 'Activar Edición'}
        </button>

        {isSaving && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Guardando...
          </div>
        )}
      </div>
    </div>
  );
};
