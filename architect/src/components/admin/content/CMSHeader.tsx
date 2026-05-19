'use client';

import { Plus } from 'lucide-react';

interface CMSHeaderProps {
  isAddingNew: boolean;
  setIsAddingNew: (b: boolean) => void;
}

export default function CMSHeader({ isAddingNew, setIsAddingNew }: CMSHeaderProps) {
  return (
    <div className="flex justify-between items-center font-sans">
      <div>
        <h2 className="text-2xl font-light text-white tracking-wide">Gestor de Contenido (CMS)</h2>
        <p className="text-zinc-500 text-sm mt-1">Edita los textos e imágenes principales de tu sitio web sin tocar código.</p>
      </div>
      <button 
        onClick={() => setIsAddingNew(!isAddingNew)}
        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm"
      >
        <Plus className="w-4 h-4" />
        Añadir Elemento
      </button>
    </div>
  );
}
