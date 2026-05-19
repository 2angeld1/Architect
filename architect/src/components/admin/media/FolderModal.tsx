'use client';

import { FolderPlus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '@/animations/variants';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  newFolderName: string;
  setNewFolderName: (n: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  savingFolder: boolean;
}

export default function FolderModal({
  isOpen,
  onClose,
  newFolderName,
  setNewFolderName,
  onSubmit,
  savingFolder,
}: FolderModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl p-6 space-y-4 z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600" />

            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-amber-500" />
                <span>Nueva Carpeta</span>
              </h3>
              <button 
                type="button"
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-zinc-400 font-medium">Nombre de la carpeta</label>
                <input
                  type="text"
                  placeholder="ej. Planos, Renders, Logos"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-650"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingFolder || !newFolderName.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-955 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                >
                  {savingFolder && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Crear</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
