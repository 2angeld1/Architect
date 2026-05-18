import axios from 'axios';
import type { Project, Reservation, BuyerInfo, PaymentInfo, ReservationType } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos de respuesta
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ============ PROJECTS ============

export const projectsApi = {
  // Obtener todos los proyectos
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },

  // Obtener un proyecto por ID
  getById: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  // Obtener proyectos por categoría
  getByCategory: async (category: string): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>(`/projects/category/${category}`);
    return response.data.data;
  },
};

// ============ CHECKOUT ============

interface CheckoutPayload {
  projectId: string;
  reservationType: ReservationType;
  buyer: BuyerInfo;
  payment: PaymentInfo;
}

interface CheckoutSummary {
  project: Partial<Project>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
}

export const checkoutApi = {
  // Procesar checkout completo
  process: async (payload: CheckoutPayload): Promise<Reservation> => {
    const response = await api.post<ApiResponse<Reservation>>('/checkout', payload);
    return response.data.data;
  },

  // Validar datos de checkout
  validate: async (payload: CheckoutPayload): Promise<{ valid: boolean; errors?: any[] }> => {
    const response = await api.post<ApiResponse<{ valid: boolean; errors?: any[] }>>('/checkout/validate', payload);
    return response.data.data;
  },

  // Obtener resumen de checkout
  getSummary: async (projectId: string): Promise<CheckoutSummary> => {
    const response = await api.get<ApiResponse<CheckoutSummary>>(`/checkout/summary/${projectId}`);
    return response.data.data;
  },
};

// ============ RESERVATIONS ============

export const reservationsApi = {
  // Obtener todas las reservas
  getAll: async (): Promise<Reservation[]> => {
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations');
    return response.data.data;
  },

  // Obtener reserva por ID
  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get<ApiResponse<Reservation>>(`/reservations/${id}`);
    return response.data.data;
  },

  // Obtener reserva por número
  getByNumber: async (reservationNumber: string): Promise<Reservation> => {
    const response = await api.get<ApiResponse<Reservation>>(`/reservations/number/${reservationNumber}`);
    return response.data.data;
  },

  // Actualizar estado de reserva
  updateStatus: async (id: string, status: string): Promise<Reservation> => {
    const response = await api.patch<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status });
    return response.data.data;
  },
};

export default api;
