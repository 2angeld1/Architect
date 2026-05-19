'use client';

import { Folder, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerRowVariants } from '@/animations/variants';

interface FolderCardProps {
  folderName: string;
  count: number;
  idx: number;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function FolderCard({
  folderName,
  count,
  idx,
  onClick,
  onDelete,
}: FolderCardProps) {
  return (
    <motion.div
      variants={staggerRowVariants}
      initial="hidden"
      animate="visible"
      custom={idx}
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-zinc-900/30 font-sans"
    >
      <div className="flex items-center gap-3">
        <Folder className="w-5 h-5 text-amber-500 fill-amber-500/10 shrink-0" />
        <div className="text-xs leading-none">
          <span className="font-semibold text-zinc-200 block group-hover:text-white capitalize transition-colors">
            {folderName}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-1 font-light">
            {count} {count === 1 ? 'archivo' : 'archivos'}
          </span>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-650 hover:text-red-400 hover:bg-red-500/10 transition-all"
        title="Eliminar carpeta"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
