'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '@/animations/variants';

interface CMSAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function CMSAlertModal({
  isOpen,
  onClose,
  title,
  message,
}: CMSAlertModalProps) {
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
            className="relative bg-zinc-955 border border-zinc-900 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl overflow-hidden z-10"
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />

            <h3 className="text-lg font-light text-zinc-100 mt-2 mb-3 tracking-wide">
              {title}
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              {message}
            </p>

            <div className="flex justify-end text-xs font-semibold">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-zinc-950 bg-white hover:bg-zinc-100 rounded-xl transition-all shadow-md active:scale-95"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
