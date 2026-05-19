'use client';

import { 
  Check, 
  Copy, 
  ExternalLink, 
  Trash2, 
  FolderInput, 
  Home, 
  Folder 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerRowVariants } from '@/animations/variants';
import { MediaFile } from '@/hooks/admin/useMediaPage';

interface MediaCardProps {
  image: MediaFile;
  idx: number;
  currentFolder: string;
  folders: string[];
  activeMoveIndex: number | null;
  setActiveMoveIndex: (idx: number | null) => void;
  copiedIndex: number | null;
  handleMoveFile: (fileIndex: number, targetFolder: string) => void;
  handleDeleteFile: (fileIndex: number, e: React.MouseEvent) => void;
  copyToClipboard: (url: string, index: number, e: React.MouseEvent) => void;
}

export default function MediaCard({
  image,
  idx,
  currentFolder,
  folders,
  activeMoveIndex,
  setActiveMoveIndex,
  copiedIndex,
  handleMoveFile,
  handleDeleteFile,
  copyToClipboard,
}: MediaCardProps) {
  return (
    <motion.div 
      variants={staggerRowVariants}
      initial="hidden"
      animate="visible"
      custom={idx}
      className="bg-zinc-955 border border-zinc-900 rounded-2xl overflow-hidden group hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between relative font-sans"
    >
      {/* Aspect ratio preview zone */}
      <div className="relative aspect-square bg-zinc-900 overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Action buttons overlays on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between">
          <div className="flex gap-2">
            <a 
              href={image.url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
              title="Ver original"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Move File action */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMoveIndex(activeMoveIndex === idx ? null : idx)}
                className={`p-2 rounded-lg border transition-colors ${activeMoveIndex === idx ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-900/90 text-zinc-300 hover:text-amber-500 border-zinc-800'}`}
                title="Mover a otra carpeta"
              >
                <FolderInput className="w-3.5 h-3.5" />
              </button>

              {/* Floating Dropdown to Move Folder */}
              {activeMoveIndex === idx && (
                <div className="absolute bottom-10 left-0 w-44 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 shadow-2xl z-30 space-y-1">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-wider font-semibold p-1.5 border-b border-zinc-900">
                    Mover a:
                  </span>
                  {/* Option: Home/Root */}
                  {currentFolder !== '' && (
                    <button
                      type="button"
                      onClick={() => handleMoveFile(idx, 'root')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-zinc-355 hover:bg-zinc-900 hover:text-white flex items-center gap-1.5"
                    >
                      <Home className="w-3 h-3 text-zinc-500" />
                      <span>[Inicio / Raíz]</span>
                    </button>
                  )}
                  {/* Option: Other custom folders */}
                  {folders.filter(f => f !== currentFolder).map((fName, fIdx) => (
                    <button
                      type="button"
                      key={fIdx}
                      onClick={() => handleMoveFile(idx, fName)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-zinc-355 hover:bg-zinc-900 hover:text-white flex items-center gap-1.5 truncate"
                    >
                      <Folder className="w-3 h-3 text-amber-500" />
                      <span className="truncate capitalize">{fName}</span>
                    </button>
                  ))}
                  {folders.filter(f => f !== currentFolder).length === 0 && currentFolder === '' && (
                    <span className="block text-[10px] text-zinc-650 font-light italic p-1.5 text-center">
                      No hay otras carpetas creadas.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => handleDeleteFile(idx, e)}
            className="p-2 rounded-lg bg-red-955/80 text-red-400 hover:text-red-300 hover:bg-red-900 border border-red-900/50 transition-colors"
            title="Eliminar archivo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metadata and Clipboard trigger */}
      <div className="p-3.5 space-y-3.5 flex-grow flex flex-col justify-between">
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-zinc-200 block truncate" title={image.name}>
            {image.name}
          </span>
          <span className="text-[9px] text-zinc-500 font-mono block">
            {new Date(image.uploadedAt).toLocaleDateString()}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => copyToClipboard(image.url, idx, e)}
          className={`
            w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-semibold transition-all duration-200
            ${copiedIndex === idx 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300'}
          `}
        >
          {copiedIndex === idx ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Enlace</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
