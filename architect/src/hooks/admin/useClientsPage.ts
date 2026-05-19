import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

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

export const useClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'spent' | 'alphabetical'>('recent');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading: loading } = useQuery<Client[]>({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const response = await fetch('/api/admin/clients');
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch clients');
      return data.data || [];
    },
  });

  const filteredClients = useMemo(() => {
    return clients
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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [clients, searchQuery, sortBy]);

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

  const totalSpentAll = useMemo(() => {
    return clients.reduce((acc, c) => acc + c.totalSpent, 0);
  }, [clients]);

  return {
    clients,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedClient,
    setSelectedClient,
    filteredClients,
    getStatusColor,
    getStatusLabel,
    totalSpentAll,
  };
};
export type { Client, Reservation };
