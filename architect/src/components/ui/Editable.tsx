'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVisualEditor } from '@/context/VisualEditorContext';
import { Image as ImageIcon, Check, X, Edit3, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface EditableTextProps {
  page: string;
  section: string;
  keyName: string;
  defaultValue: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export const EditableText = ({
  page,
  section,
  keyName,
  defaultValue,
  className = '',
  as: Component = 'span',
}: EditableTextProps) => {
  const { isEditMode, saveBlock } = useVisualEditor();
  const [value, setValue] = useState(defaultValue);
  const elementRef = useRef<any>(null);

  // Sync value if defaultValue changes (e.g. CMS fetches new data)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleBlur = async () => {
    if (!elementRef.current) return;
    const newValue = elementRef.current.innerText.trim();
    
    if (newValue === '') {
      elementRef.current.innerText = value; // Restore old value if empty
      toast.error('El texto no puede estar vacío.');
      return;
    }

    if (newValue !== value) {
      try {
        setValue(newValue);
        await saveBlock({
          page,
          section,
          key: keyName,
          value: newValue,
          type: 'text',
        });
      } catch (e) {
        elementRef.current.innerText = value; // Restore on error
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current?.blur(); // Triggers handleBlur
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={`
        ${className}
        inline-block outline-dashed outline-1 outline-amber-500/50 hover:outline-amber-500 hover:bg-amber-500/5 
        cursor-text rounded px-1 transition-all focus:outline-solid focus:outline-2 focus:outline-amber-400 
        focus:bg-amber-500/10 focus:shadow-md focus:shadow-amber-500/10
      `}
      title="Haz clic para editar este texto directamente"
    >
      {value}
    </Component>
  );
};

interface EditableImageProps {
  page: string;
  section: string;
  keyName: string;
  defaultUrl: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  buttonClassName?: string;
}

export const EditableImage = ({
  page,
  section,
  keyName,
  defaultUrl,
  alt,
  className = '',
  containerClassName = '',
  buttonClassName = 'top-3 right-3',
}: EditableImageProps) => {
  const { isEditMode, saveBlock } = useVisualEditor();
  const [url, setUrl] = useState(defaultUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);

  // Fetch recent media files from admin media library
  const { data: mediaData } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/media');
        if (!response.ok) return { files: [] };
        const data = await response.json();
        let files = [];
        if (Array.isArray(data.images)) {
          files = data.images;
        } else if (data.images && typeof data.images === 'object') {
          files = data.images.files || [];
        }
        return { files };
      } catch (e) {
        return { files: [] };
      }
    },
    enabled: isEditMode,
  });

  const recentImages = mediaData?.files || [];

  useEffect(() => {
    setUrl(defaultUrl);
    setInputUrl(defaultUrl);
  }, [defaultUrl]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputUrl.trim()) return;

    try {
      setUrl(inputUrl.trim());
      setIsEditing(false);
      await saveBlock({
        page,
        section,
        key: keyName,
        value: inputUrl.trim(),
        type: 'image',
      });
      toast.success('¡Imagen actualizada con éxito!');
    } catch (e) {
      setUrl(defaultUrl);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading('Subiendo imagen a Cloudinary...', { id: 'image-upload' });

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64String }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Fallo en la subida');

          setInputUrl(data.url);
          setUrl(data.url);

          // Save directly to the database
          await saveBlock({
            page,
            section,
            key: keyName,
            value: data.url,
            type: 'image',
          });

          // Register in the media library so it is saved in recent photos
          try {
            const mediaRes = await fetch('/api/admin/media');
            if (mediaRes.ok) {
              const mediaData = await mediaRes.json();
              let curFiles = [];
              let curFolders = [];
              if (Array.isArray(mediaData.images)) {
                curFiles = mediaData.images;
              } else if (mediaData.images && typeof mediaData.images === 'object') {
                curFiles = mediaData.images.files || [];
                curFolders = mediaData.images.folders || [];
              }

              const newImage = {
                url: data.url,
                name: file.name.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' '),
                uploadedAt: new Date().toISOString(),
              };

              await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  images: {
                    folders: curFolders,
                    files: [newImage, ...curFiles]
                  }
                }),
              });
            }
          } catch (err) {
            console.error('Error auto-registering uploaded file in Media Library:', err);
          }

          setIsEditing(false);
          toast.success('¡Imagen subida e instalada con éxito!', { id: 'image-upload' });
        } catch (uploadErr: any) {
          toast.error(uploadErr.message || 'Error al subir el archivo', { id: 'image-upload' });
        } finally {
          setUploading(false);
        }
      };
    } catch (err: any) {
      toast.error('Error al procesar archivo local', { id: 'image-upload' });
      setUploading(false);
    }
  };

  if (!isEditMode) {
    return <img src={url} alt={alt} className={className} />;
  }

  return (
    <div className={`relative group/image ${containerClassName} inline-block w-full h-full z-10`}>
      {/* Target Image with Amber outline */}
      <img
        src={url}
        alt={alt}
        className={`${className} outline-dashed outline-2 outline-amber-500/70 rounded-xl transition-all group-hover/image:opacity-85`}
      />

      {/* Floating Button overlay */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className={`absolute ${buttonClassName} bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-2 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 transition-all active:scale-95 z-30`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Cambiar Imagen</span>
        </button>
      ) : (
        <form
          onSubmit={handleSave}
          className="absolute inset-x-3 bottom-3 bg-zinc-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 flex flex-col gap-2.5 z-40 shadow-2xl"
        >
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
            <Edit3 className="w-3 h-3" />
            Editar Enlace de Imagen
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              placeholder="Enlace o selecciona abajo..."
              autoFocus
            />

            {/* File Upload Trigger */}
            <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-xl border border-zinc-800 flex items-center justify-center transition-all active:scale-95" title="Subir desde PC">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              ) : (
                <Upload className="w-4 h-4 text-amber-500" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 p-2 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              title="Guardar"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setInputUrl(url);
                setIsEditing(false);
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-xl flex items-center justify-center transition-all active:scale-95"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Images from Media Library */}
          {recentImages.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1 border-t border-zinc-800/80 pt-2 text-left">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                Seleccionar Recientes:
              </span>
              <div className="grid grid-cols-5 gap-1.5 max-h-[80px] overflow-y-auto pr-1">
                {recentImages.slice(0, 10).map((media: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputUrl(media.url);
                      toast.success('Imagen seleccionada ✔');
                    }}
                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                      inputUrl === media.url ? 'border-amber-500' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                    title={media.name || 'Imagen reciente'}
                  >
                    <img
                      src={media.url}
                      alt={media.name || 'Reciente'}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
