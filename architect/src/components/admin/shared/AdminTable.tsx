'use client';

import { flexRender, Table } from '@tanstack/react-table';
import { ArrowRight, ArrowLeft, Loader2, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp, staggerRowVariants } from '@/animations/variants';

interface AdminTableProps<TData> {
  table: Table<TData>;
  isLoading: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onRowClick?: (row: TData) => void;
}

export default function AdminTable<TData>({
  table,
  isLoading,
  emptyMessage = 'No se encontraron registros.',
  loadingMessage = 'Cargando datos...',
  onRowClick,
}: AdminTableProps<TData>) {
  const columns = table.getVisibleFlatColumns();
  const rows = table.getRowModel().rows;
  const hasData = rows.length > 0;

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-zinc-800/80 bg-zinc-900/30">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-5 font-medium text-zinc-400 text-xs uppercase tracking-widest whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading && !hasData ? (
              <tr>
                <td colSpan={columns.length} className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    <span className="text-zinc-500 text-sm font-light">{loadingMessage}</span>
                  </div>
                </td>
              </tr>
            ) : !hasData ? (
              <tr>
                <td colSpan={columns.length} className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Inbox className="w-8 h-8 text-zinc-700" />
                    <span className="text-zinc-500 text-sm font-light">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <motion.tr
                  variants={staggerRowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasData && (
        <div className="p-5 border-t border-zinc-800/80 flex items-center justify-between text-sm text-zinc-400 font-sans">
          <div>
            Página <span className="text-white">{table.getState().pagination.pageIndex + 1}</span> de{' '}
            <span className="text-white">{table.getPageCount()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
