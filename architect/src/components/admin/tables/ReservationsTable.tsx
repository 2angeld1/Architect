'use client';

import { useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminStore, Reservation } from '@/store/useAdminStore';

const columnHelper = createColumnHelper<Reservation>();

const statusColors = {
  pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function ReservationsTable() {
  const { reservations, isLoading, fetchReservations, updateReservationStatus } = useAdminStore();

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const columns = [
    columnHelper.accessor('reservationNumber', {
      header: 'ID Reserva',
      cell: info => <span className="font-mono text-zinc-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('project.name', {
      header: 'Proyecto',
      cell: info => <span className="font-medium text-zinc-100">{info.getValue() || 'N/A'}</span>,
    }),
    columnHelper.accessor(row => `${row.buyer?.firstName || ''} ${row.buyer?.lastName || ''}`, {
      id: 'buyer',
      header: 'Cliente',
      cell: info => <span className="text-zinc-400">{info.getValue() || 'Desconocido'}</span>,
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Monto',
      cell: info => <span className="text-zinc-300">${Number(info.getValue() || 0).toLocaleString()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: info => {
        const currentStatus = info.getValue();
        return (
          <select 
            value={currentStatus}
            onChange={(e) => updateReservationStatus(info.row.original.id, e.target.value as Reservation['status'])}
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize outline-none cursor-pointer appearance-none ${statusColors[currentStatus]}`}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha',
      cell: info => <span className="text-zinc-500 text-sm">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="flex items-center justify-end">
          <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: reservations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-white tracking-wide">Reservas y Órdenes</h2>
          <p className="text-zinc-500 text-sm mt-1">Monitorea las reservas y actualiza los pagos de clientes.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-zinc-800/80 bg-zinc-900/30">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-5 font-medium text-zinc-400 text-sm whitespace-nowrap">
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
              {isLoading && reservations.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-zinc-500">
                    Cargando reservas...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-zinc-500">
                    No hay reservas registradas.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={row.id} 
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
                  >
                    {row.getVisibleCells().map(cell => (
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
        {reservations.length > 0 && (
          <div className="p-5 border-t border-zinc-800/80 flex items-center justify-between text-sm text-zinc-400">
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
    </div>
  );
}
