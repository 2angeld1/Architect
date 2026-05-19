'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVisualEditor } from '@/context/VisualEditorContext';
import { Image as ImageIcon, Check, X, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

export const EditableImage = ({
  page,
  section,
  keyName,
  defaultUrl,
  alt,
  className = '',
  containerClassName = '',
}: EditableImageProps) => {
  const { isEditMode, saveBlock } = useVisualEditor();
  const [url, setUrl] = useState(defaultUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState(defaultUrl);

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
    } catch (e) {
      setUrl(defaultUrl);
    }
  };

  if (!isEditMode) {
    return <img src={url} alt={alt} className={className} />;
  }

  return (
    <div className={`relative group/image ${containerClassName} inline-block w-full h-full`}>
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
          className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-2 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 transition-all active:scale-95 z-30"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Cambiar Imagen</span>
        </button>
      ) : (
        <form
          onSubmit={handleSave}
          className="absolute inset-x-3 bottom-3 bg-zinc-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 flex flex-col gap-2 z-40 shadow-2xl"
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
              placeholder="https://ejemplo.com/imagen.jpg"
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 p-2 rounded-xl flex items-center justify-center transition-all active:scale-95"
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
        </form>
      )}
    </div>
  );
};
