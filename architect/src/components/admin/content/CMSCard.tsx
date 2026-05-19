'use client';

import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Trash2, Edit3 } from 'lucide-react';
import { staggerRowVariants } from '@/animations/variants';

interface CMSCardProps {
  item: any;
  idx: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CMSCard({
  item,
  idx,
  onEdit,
  onDelete,
}: CMSCardProps) {
  return (
    <motion.div 
      variants={staggerRowVariants}
      initial="hidden"
      animate="visible"
      custom={idx}
      onClick={onEdit}
      className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-700/60 rounded-2xl p-5 flex flex-col justify-between min-h-[170px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg active:scale-[0.98] font-sans"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {item.type === 'image' ? (
              <ImageIcon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Type className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              {item.type === 'richtext' ? 'párrafo' : item.type}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Eliminar elemento"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h4 className="text-white font-medium text-sm capitalize mb-2 group-hover:text-indigo-300 transition-colors truncate">
          {item.section} <span className="text-zinc-500 font-normal">/</span> {item.key}
        </h4>

        {/* Truncated preview value */}
        <div className="text-xs text-zinc-400 font-light line-clamp-3">
          {item.type === 'image' ? (
            item.value ? (
              <div className="flex items-center gap-2 text-zinc-500 italic mt-1 bg-zinc-950/40 p-1.5 rounded border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.value} alt={item.key} className="w-6 h-6 object-cover rounded-md" />
                <span className="truncate">{item.value}</span>
              </div>
            ) : (
              <span className="text-zinc-650 italic">Sin imagen configurada</span>
            )
          ) : item.value ? (
            item.value
          ) : (
            <span className="text-zinc-655 italic">Vacío</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors pt-2 border-t border-zinc-800/30">
        <span>Hacer clic para editar</span>
        <Edit3 className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </motion.div>
  );
}
