'use client';

import { motion } from 'framer-motion';
import { LayoutTemplate } from 'lucide-react';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';

interface NewContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPage: string;
  newContent: any;
  setNewContent: (content: any) => void;
  onSubmit: () => void;
}

export default function NewContentForm({
  isOpen,
  onClose,
  selectedPage,
  newContent,
  setNewContent,
  onSubmit,
}: NewContentFormProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 font-sans mb-6"
    >
      <h3 className="text-white font-medium mb-4 flex items-center gap-2 text-sm">
        <LayoutTemplate className="w-5 h-5 text-indigo-400" /> Nuevo elemento para la página "{selectedPage}"
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Sección (ej. hero, footer)</label>
          <input 
            type="text" 
            value={newContent.section}
            onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Identificador (ej. title, subtitle)</label>
          <input 
            type="text" 
            value={newContent.key}
            onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
            className="w-full bg-zinc-955 border border-zinc-800 text-white rounded-lg p-2 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Tipo de Contenido</label>
          <select 
            value={newContent.type}
            onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
            className="w-full bg-zinc-955 border border-zinc-800 text-white rounded-lg p-2 outline-none text-sm cursor-pointer"
          >
            <option value="text">Texto Corto</option>
            <option value="richtext">Párrafo Largo</option>
            <option value="image">Imagen</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-zinc-400 mb-1">Valor inicial</label>
        {newContent.type === 'text' ? (
          <input
            type="text"
            value={newContent.value}
            onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
            className="w-full bg-zinc-955 border border-zinc-800 text-white rounded-lg p-3 outline-none text-sm"
          />
        ) : newContent.type === 'image' ? (
          <CloudinaryUploader
            currentImage={newContent.value}
            onUpload={(url) => setNewContent({ ...newContent, value: url })}
            onRemove={() => setNewContent({ ...newContent, value: '' })}
          />
        ) : (
          <textarea
            rows={8}
            value={newContent.value}
            onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
            className="w-full bg-zinc-955 border border-zinc-800 text-white rounded-lg p-3 outline-none resize-y min-h-[150px] text-sm"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 text-sm font-semibold">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-zinc-400 hover:text-white"
        >Cancelar</button>
        <button 
          onClick={onSubmit}
          className="px-4 py-2 bg-white text-zinc-955 hover:bg-zinc-100 rounded-lg transition-colors"
        >Guardar Elemento</button>
      </div>
    </motion.div>
  );
}
