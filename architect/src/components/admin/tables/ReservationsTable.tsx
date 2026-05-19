'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Eye, FileText, CheckCircle2, User, CreditCard, Building2, Mail, Phone } from 'lucide-react';
import type { Reservation } from '@/store/useAdminStore';
import AdminDrawer from '../shared/AdminDrawer';
import AdminTable from '../shared/AdminTable';

const columnHelper = createColumnHelper<Reservation>();

const statusColors = {
  pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'En Proceso',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Completado',
};

export default function ReservationsTable() {
  const queryClient = useQueryClient();
  
  // State for the modal
  const [selectedQuote, setSelectedQuote] = useState<Reservation | null>(null);

  const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const res = await fetch('/api/reservations');
      const json = await res.json();
      if (!res.ok) throw new Error('Error fetching reservations');
      return json.data || [];
    }
  });

  const { mutate: updateReservationStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Reservation['status'] }) => {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Error updating status');
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    }
  });

  const columns = [
    columnHelper.accessor('reservationNumber', {
      header: 'ID Cotización',
      cell: info => <span className="font-mono text-zinc-300 text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md">{info.getValue()}</span>,
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
      header: 'Monto Estimado',
      cell: info => <span className="text-zinc-300 font-semibold font-mono">${Number(info.getValue() || 0).toLocaleString()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: info => {
        const currentStatus = info.getValue();
        return (
          <select 
            value={currentStatus}
            onChange={(e) => updateReservationStatus({ id: info.row.original.id, status: e.target.value as Reservation['status'] })}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider border uppercase outline-none cursor-pointer appearance-none ${statusColors[currentStatus]}`}
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha Solicitud',
      cell: info => <span className="text-zinc-500 text-sm font-mono">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center justify-end">
          <button 
            onClick={() => setSelectedQuote(info.row.original)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all duration-200"
            title="Ver Detalles de la Cotización"
          >
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
          <h2 className="text-2xl font-light text-white tracking-wide">Cotizaciones y Órdenes</h2>
          <p className="text-zinc-500 text-sm mt-1">Monitorea las cotizaciones y actualiza el estado de las solicitudes.</p>
        </div>
      </div>

      <AdminTable 
        table={table}
        isLoading={isLoading}
        emptyMessage="No hay cotizaciones registradas."
        loadingMessage="Cargando listado de cotizaciones..."
      />

      {/* DETALLE DE COTIZACIÓN MODAL */}
      <AdminDrawer
        isOpen={selectedQuote !== null}
        onClose={() => setSelectedQuote(null)}
        maxWidth="xl"
        title={
          <>
            <FileText className="w-6 h-6 text-zinc-400" />
            Detalle de Cotización
          </>
        }
        description={selectedQuote ? `ID: ${selectedQuote.reservationNumber}` : ''}
        footer={
          <div className="flex justify-end">
            <button 
              onClick={() => setSelectedQuote(null)}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-sans"
            >
              Cerrar Detalles
            </button>
          </div>
        }
      >
        {selectedQuote && (
          <div className="space-y-8 font-sans">
            {/* Status Card */}
            <div className={`p-4 rounded-xl border ${statusColors[selectedQuote.status]} bg-opacity-5 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold uppercase tracking-wider text-xs">
                  ESTADO: {statusLabels[selectedQuote.status]}
                </span>
              </div>
              <div className="text-xs opacity-70 font-mono">
                {new Date(selectedQuote.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Grid Layout for details */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Client Info */}
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <User className="w-4 h-4 text-zinc-400" /> Datos del Cliente
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Nombre Completo</p>
                    <p className="text-sm text-zinc-200 font-medium">{selectedQuote.buyer?.firstName} {selectedQuote.buyer?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Documento ({selectedQuote.buyer?.documentType?.toUpperCase()})</p>
                    <p className="text-sm text-zinc-200 font-medium font-mono">{selectedQuote.buyer?.documentNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Correo Electrónico</p>
                    <p className="text-sm text-zinc-200 font-medium break-all">{selectedQuote.buyer?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Teléfono</p>
                    <p className="text-sm text-zinc-200 font-medium font-mono">{selectedQuote.buyer?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Building2 className="w-4 h-4 text-zinc-400" /> Proyecto Arquitectónico
                </h3>
                <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg text-white font-medium">{selectedQuote.project?.name}</p>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">{selectedQuote.project?.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 mb-1">Monto Estimado</p>
                      <p className="text-lg text-emerald-400 font-bold font-mono">${Number(selectedQuote.totalAmount).toLocaleString()} {selectedQuote.currency}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-zinc-800/50">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase">Área</p>
                      <p className="text-sm text-zinc-200 font-mono">{selectedQuote.project?.area} m²</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase">Estilo</p>
                      <p className="text-sm text-zinc-200">{selectedQuote.project?.style || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase">Niveles</p>
                      <p className="text-sm text-zinc-200 font-mono">{selectedQuote.project?.floors || 1}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment/Request Info */}
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <CreditCard className="w-4 h-4 text-zinc-400" /> Detalles de Solicitud
                </h3>
                <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Tipo de Solicitud</span>
                    <span className="text-sm text-zinc-200 capitalize">{selectedQuote.type === 'quote' ? 'Cotización Formal' : 'Compra Directa'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Método Deseado</span>
                    <span className="text-sm text-zinc-200 capitalize">{selectedQuote.paymentInfo?.paymentMethod || 'Cotización'}</span>
                  </div>
                  {selectedQuote.notes && (
                    <div className="pt-3 border-t border-zinc-800/50">
                      <span className="text-xs text-zinc-500 block mb-2 uppercase tracking-wider">Notas del Cliente</span>
                      <p className="text-sm text-zinc-300 italic bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
                        "{selectedQuote.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
