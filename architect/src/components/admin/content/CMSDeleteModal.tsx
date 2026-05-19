'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '@/animations/variants';

interface CMSDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

export default function CMSDeleteModal({
  isOpen,
  onClose,
  title,
  message,
  isDanger = true,
  onConfirm,
}: CMSDeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-zinc-955 border border-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl overflow-hidden z-10"
          >
            {/* Decorative top border */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isDanger ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`} />

            <h3 className="text-xl font-light text-zinc-100 mt-2 mb-3 tracking-wide">
              {title}
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              {message}
            </p>

            <div className="flex justify-end gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-5 py-2 text-white rounded-xl transition-all shadow-md active:scale-95 ${isDanger
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
