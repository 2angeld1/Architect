'use client';

import { Images, Loader2, UploadCloud, FolderPlus, Home, ChevronRight } from 'lucide-react';

interface MediaHeaderProps {
  currentFolder: string;
  setCurrentFolder: (folder: string) => void;
  uploading: boolean;
  setIsFolderModalOpen: (open: boolean) => void;
  handleUploadClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaHeader({
  currentFolder,
  setCurrentFolder,
  uploading,
  setIsFolderModalOpen,
  handleUploadClick,
  handleFileChange,
}: MediaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5 font-sans">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
            <Images className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-light tracking-tight">Galería de Medios</h1>
        </div>
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
          <button 
            onClick={() => setCurrentFolder('')}
            className={`hover:text-zinc-200 flex items-center gap-1 ${currentFolder === '' ? 'text-zinc-400 font-medium' : ''}`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Inicio (Raíz)</span>
          </button>
          
          {currentFolder && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-700" />
              <span className="text-zinc-300 font-medium capitalize bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                {currentFolder}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Circular Progress Loader */}
        {uploading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-850 py-2 px-3 rounded-xl animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Subiendo archivo...</span>
          </div>
        )}

        {/* Create Folder Button */}
        <button
          onClick={() => setIsFolderModalOpen(true)}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 bg-zinc-955 hover:bg-zinc-900 text-zinc-350 transition-all duration-200 active:scale-[0.98]"
        >
          <FolderPlus className="w-4 h-4 text-amber-500" />
          <span>Crear Carpeta</span>
        </button>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-semibold text-zinc-955 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5"
        >
          <UploadCloud className="w-4 h-4 text-zinc-955" />
          <span>Subir Imagen</span>
        </button>

        {/* Hidden File Input */}
        <input 
          type="file" 
          id="hidden-file-input" 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
