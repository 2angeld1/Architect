'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText,
  Loader2,
  X,
  CreditCard
} from 'lucide-react';
import clsx from 'clsx';

interface Reservation {
  id: string;
  reservationNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  notes: string | null;
  createdAt: string;
  reservations: Reservation[];
  totalSpent: number;
  reservationsCount: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'spent' | 'alphabetical'>('recent');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      const data = await response.json();
      if (response.ok) {
        setClients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar y ordenar clientes
  const filteredClients = clients
    .filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const email = client.email.toLowerCase();
      const location = `${client.city} ${client.state} ${client.country}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query) || location.includes(query);
    })
    .sort((a, b) => {
      if (sortBy === 'spent') {
        return b.totalSpent - a.totalSpent;
      }
      if (sortBy === 'alphabetical') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      // 'recent'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'pending':
      case 'processing':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

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
            <span className="text-2xl font-semibold text-white">
              ${clients.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
      {filteredClients.length === 0 ? (
        <div className="text-center py-16 bg-zinc-950/20 border border-zinc-900/60 rounded-2xl">
          <Users className="w-8 h-8 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 font-light">No se encontraron clientes con los filtros actuales.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wider font-semibold bg-zinc-900/20">
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Contacto</th>
                  <th className="py-4 px-6">Ubicación</th>
                  <th className="py-4 px-6 text-center">Reservas</th>
                  <th className="py-4 px-6 text-right">Invertido</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-zinc-900/30 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                        {client.firstName} {client.lastName}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {client.documentType.toUpperCase()}: {client.documentNumber}
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Phone className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{client.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span className="truncate max-w-[160px]">{client.city}, {client.country}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-medium">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs">
                        {client.reservationsCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-zinc-100">
                      ${client.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Detail Drawer Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-xl h-screen bg-zinc-950 border-l border-zinc-900/80 p-8 overflow-y-auto flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100">Detalle del Cliente</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">ID: {selectedClient.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* General Client Details */}
              <div className="space-y-6">
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
                    <a href={`mailto:${selectedClient.email}`} className="text-sm text-zinc-200 hover:underline flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{selectedClient.email}</span>
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Teléfono</span>
                    <a href={`tel:${selectedClient.phone}`} className="text-sm text-zinc-200 hover:underline flex items-center gap-1.5">
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
                  <h5 className="text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-900 pb-1.5">Historial de Reservas ({selectedClient.reservationsCount})</h5>
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
                              <span className="font-semibold text-sm text-zinc-200">#{res.reservationNumber}</span>
                              <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none", getStatusColor(res.status))}>
                                {getStatusLabel(res.status)}
                              </span>
                            </div>
                            <span className="block text-[10px] text-zinc-500">
                              {new Date(res.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          
                          <span className="font-bold text-sm text-white">
                            ${Number(res.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Summary Info */}
            <div className="mt-8 border-t border-zinc-900 pt-6 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Total Compras</span>
                <span className="text-2xl font-semibold text-white">
                  ${selectedClient.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-xs text-zinc-500">
                Miembro desde: {new Date(selectedClient.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
