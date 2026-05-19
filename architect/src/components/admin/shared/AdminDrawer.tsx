'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { backdropVariants, drawerVariants } from '@/animations/variants';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const widthClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export default function AdminDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'xl',
}: AdminDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-y-0 right-0 w-full ${widthClasses[maxWidth]} bg-zinc-950 border-l border-zinc-800/80 shadow-2xl z-[101] overflow-y-auto flex flex-col justify-between`}
          >
            {/* Main Area (Header + Scrollable Content) */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header */}
              <div className="p-8 border-b border-zinc-900 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-light text-white font-sans flex items-center gap-2.5">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm text-zinc-500 mt-1 font-sans">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {children}
              </div>
            </div>

            {/* Sticky Footer */}
            {footer && (
              <div className="p-8 border-t border-zinc-900/80 bg-zinc-950 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
