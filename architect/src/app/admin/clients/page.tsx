'use client';

import { Users, Search, ChevronRight, Mail, Phone, MapPin, Loader2, CreditCard } from 'lucide-react';
import clsx from 'clsx';
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import AdminDrawer from '@/components/admin/shared/AdminDrawer';
import AdminTable from '@/components/admin/shared/AdminTable';
import { useClientsPage, Client } from '@/hooks/admin/useClientsPage';

const columnHelper = createColumnHelper<Client>();

export default function ClientsPage() {
  const { clients, loading, searchQuery, setSearchQuery, sortBy, setSortBy, selectedClient, setSelectedClient, filteredClients, getStatusColor, getStatusLabel, totalSpentAll, } = useClientsPage();

  const columns = [
    columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
      id: 'name',
      header: 'Cliente',
      cell: info => {
        const client = info.row.original;
        return (
          <div>
            <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors font-sans">
              {client.firstName} {client.lastName}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5 font-mono">
              {client.documentType.toUpperCase()}: {client.documentNumber}
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('email', {
      header: 'Contacto',
      cell: info => {
        const client = info.row.original;
        return (
          <div className="space-y-1 font-sans">
            <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-zinc-600" />
              <span className="font-mono">{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Phone className="w-3.5 h-3.5 text-zinc-600" />
              <span className="font-mono">{client.phone}</span>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('city', {
      header: 'Ubicación',
      cell: info => {
        const client = info.row.original;
        return (
          <div className="flex items-center gap-1.5 text-zinc-400 font-sans">
            <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="truncate max-w-[160px]">{client.city}, {client.country}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('reservationsCount', {
      header: 'Cotizaciones',
      cell: info => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-mono">
            {info.getValue()}
          </span>
        </div>
      )
    }),
    columnHelper.accessor('totalSpent', {
      header: 'Invertido',
      cell: info => (
        <div className="text-right font-semibold text-zinc-100 font-mono">
          ${info.getValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      )
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="flex items-center justify-end">
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      )
    })
  ];

  const table = useReactTable({
    data: filteredClients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <p className="text-sm font-light">Cargando base de clientes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-zinc-100">Clientes</h2>
          <p className="text-zinc-500 text-sm mt-1">Administra y haz seguimiento de la cartera de compradores y prospectos.</p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-6 bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-3.5 shadow-xl">
          <div className="text-center">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Total Clientes</span>
            <span className="text-2xl font-semibold text-zinc-100">{clients.length}</span>
          </div>
          <div className="w-px h-8 bg-zinc-900" />
          <div className="text-center">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Total Recaudado</span>
            <span className="text-2xl font-semibold text-white font-mono">
              ${totalSpentAll.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-900 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all duration-200"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-zinc-950 border border-zinc-900 rounded-xl text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all duration-200 cursor-pointer"
          >
            <option value="recent">Más Recientes</option>
            <option value="spent">Mayor Facturación</option>
            <option value="alphabetical">Alfabético</option>
          </select>
        </div>
      </div>

      {/* Clients Table / List */}
      <AdminTable
        table={table}
        isLoading={loading}
        onRowClick={setSelectedClient}
        emptyMessage="No se encontraron clientes con los filtros actuales."
        loadingMessage="Cargando base de clientes..."
      />

      {/* Client Detail Drawer Modal */}
      <AdminDrawer
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        maxWidth="xl"
        title={
          <>
            <Users className="w-5 h-5 text-zinc-400" />
            Detalle del Cliente
          </>
        }
        description={selectedClient ? `ID: ${selectedClient.id}` : ''}
        footer={
          selectedClient && (
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Total Compras</span>
                <span className="text-2xl font-semibold text-white font-mono">
                  ${selectedClient.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-sans font-mono">
                Miembro desde: {new Date(selectedClient.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          )
        }
      >
        {selectedClient && (
          <div className="space-y-6 font-sans">
            <div>
              <h4 className="text-2xl font-light text-zinc-100 mb-1">
                {selectedClient.firstName} {selectedClient.lastName}
              </h4>
              <span className="inline-block text-xs uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-semibold">
                {selectedClient.documentType.toUpperCase()}: {selectedClient.documentNumber}
              </span>
            </div>

            {/* Contact grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Correo</span>
                <a href={`mailto:${selectedClient.email}`} className="text-sm text-zinc-200 hover:underline flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{selectedClient.email}</span>
                </a>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Teléfono</span>
                <a href={`tel:${selectedClient.phone}`} className="text-sm text-zinc-200 hover:underline flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{selectedClient.phone}</span>
                </a>
              </div>
            </div>

            {/* Address details */}
            <div className="space-y-3">
              <h5 className="text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-900 pb-1.5">Dirección y Residencia</h5>
              <div className="space-y-2 text-sm text-zinc-300">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                  <div>
                    <p>{selectedClient.address}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {selectedClient.city}, {selectedClient.state}, {selectedClient.postalCode}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedClient.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedClient.notes && (
              <div className="space-y-2">
                <h5 className="text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-900 pb-1.5">Notas adicionales</h5>
                <p className="text-sm text-zinc-400 font-light leading-relaxed p-4 bg-zinc-900/20 border border-zinc-900/60 rounded-xl italic">
                  "{selectedClient.notes}"
                </p>
              </div>
            )}

            {/* Reservations List */}
            <div className="space-y-4">
              <h5 className="text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-900 pb-1.5">Historial de Cotizaciones ({selectedClient.reservationsCount})</h5>
              {selectedClient.reservations.length === 0 ? (
                <p className="text-sm text-zinc-500 font-light">Este cliente aún no ha registrado transacciones.</p>
              ) : (
                <div className="space-y-2">
                  {selectedClient.reservations.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-zinc-200 font-mono">#{res.reservationNumber}</span>
                          <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none", getStatusColor(res.status))}>
                            {getStatusLabel(res.status)}
                          </span>
                        </div>
                        <span className="block text-[10px] text-zinc-500 font-mono">
                          {new Date(res.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <span className="font-bold text-sm text-white font-mono">
                        ${Number(res.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
