'use client';

import { Plus, Info } from 'lucide-react';

interface CMSHeaderProps {
  isAddingNew: boolean;
  setIsAddingNew: (b: boolean) => void;
  onInfoClick: () => void;
}

export default function CMSHeader({ isAddingNew, setIsAddingNew, onInfoClick }: CMSHeaderProps) {
  return (
    <div className="flex justify-between items-center font-sans">
      <div>
        <h2 className="text-2xl font-light text-white tracking-wide">Gestor de Contenido (CMS)</h2>
        <p className="text-zinc-500 text-sm mt-1">Edita los textos e imágenes principales de tu sitio web sin tocar código.</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onInfoClick}
          className="p-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all bg-zinc-900/40"
          title="Manual de Uso del CMS"
        >
          <Info className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir Elemento
        </button>
      </div>
    </div>
  );
}
