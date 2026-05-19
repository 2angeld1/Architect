// @ts-ignore
import { create } from 'zustand';

export type Project = {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
};

export type Reservation = {
  id: string;
  reservationNumber: string;
  project: { 
    name: string; 
    category?: string; 
    area?: number; 
    style?: string; 
    floors?: number;
  };
  buyer: { 
    firstName: string; 
    lastName: string;
    documentType?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
  };
  status: 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  currency?: string;
  type?: string;
  paymentInfo?: {
    paymentMethod?: string;
  };
  notes?: string;
  createdAt: string;
};

type AdminStore = {
  projects: Project[];
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<boolean>;
  updateProject: (id: string, data: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  fetchReservations: () => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<boolean>;
};

export const useAdminStore = create<AdminStore>()((set: any, get: any) => ({
  projects: [],
  reservations: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Error fetching projects');
      const json = await res.json();
      set({ projects: json.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createProject: async (data: Partial<Project>) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error creating project');
      await get().fetchProjects();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  updateProject: async (id: string, data: Partial<Project>) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error updating project');
      await get().fetchProjects();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error deleting project');
      
      set((state: AdminStore) => ({
        projects: state.projects.filter((p: Project) => p.id !== id),
        isLoading: false
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  fetchReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/reservations');
      if (!res.ok) throw new Error('Error fetching reservations');
      const json = await res.json();
      set({ reservations: json.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateReservationStatus: async (id: string, status: Reservation['status']) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Error updating status');
      
      await get().fetchReservations();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  }
}));
