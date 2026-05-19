'use client';

import { Save, Loader2, Image as ImageIcon, Type } from 'lucide-react';
import AdminDrawer from '@/components/admin/shared/AdminDrawer';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';

interface CMSEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editModal: any;
  setEditModal: (modal: any) => void;
  isSaving: string | null;
  handleSaveChanges: () => void;
}

export default function CMSEditDrawer({
  isOpen,
  onClose,
  editModal,
  setEditModal,
  isSaving,
  handleSaveChanges,
}: CMSEditDrawerProps) {
  const { item, originalValue } = editModal;

  return (
    <AdminDrawer
      isOpen={isOpen && item !== null}
      onClose={onClose}
      maxWidth="3xl"
      title={
        item ? (
          <div className="flex items-center gap-2 font-sans text-zinc-100">
            {item.type === 'image' ? (
              <ImageIcon className="w-5 h-5 text-zinc-400" />
            ) : (
              <Type className="w-5 h-5 text-zinc-400" />
            )}
            <span>Editar Contenido: {item.section} / {item.key}</span>
          </div>
        ) : ''
      }
      description={item ? `Página: ${item.page} | Tipo: ${item.type.toUpperCase()}` : ''}
      footer={
        item && (
          <div className="flex justify-end gap-3 w-full text-xs font-semibold font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="cms-edit-form"
              disabled={isSaving === item.id || item.value === originalValue}
              className="flex items-center gap-2 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 text-zinc-955 disabled:text-zinc-500 px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:scale-100 disabled:pointer-events-none"
            >
              {isSaving === item.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        )
      }
    >
      {item && (
        <form 
          id="cms-edit-form" 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleSaveChanges(); 
          }} 
          className="space-y-6 font-sans"
        >
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Contenido / Valor</label>
            
            {item.type === 'text' && (
              <input 
                type="text" 
                value={item.value}
                onChange={(e) => setEditModal({
                  ...editModal,
                  item: { ...item, value: e.target.value }
                })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none focus:border-zinc-700 transition-colors text-sm"
                required
              />
            )}
            
            {item.type === 'richtext' && (
              <textarea 
                rows={14}
                value={item.value}
                onChange={(e) => setEditModal({
                  ...editModal,
                  item: { ...item, value: e.target.value }
                })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none resize-y min-h-[350px] focus:border-zinc-700 transition-colors text-sm"
                required
              />
            )}

            {item.type === 'image' && (
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                <CloudinaryUploader 
                  currentImage={item.value}
                  onUpload={(url) => setEditModal({
                    ...editModal,
                    item: { ...item, value: url }
                  })}
                  onRemove={() => setEditModal({
                    ...editModal,
                    item: { ...item, value: '' }
                  })}
                  label="Reemplazar Imagen"
                />
              </div>
            )}
          </div>
        </form>
      )}
    </AdminDrawer>
  );
}
