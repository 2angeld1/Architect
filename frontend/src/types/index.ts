// Tipos para los proyectos arquitectónicos
export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  price: number;
  currency: string;
  images: string[];
  features: string[];
  area: number; // metros cuadrados
  rooms: number;
  bathrooms: number;
  floors: number;
  style: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory = 
  | 'residencial' 
  | 'comercial' 
  | 'industrial' 
  | 'institucional'
  | 'mixto';

export interface Category {
  id: string | number;
  name: string;
  description?: string;
  count: number;
  image: string;
  icon: any; // Using any to avoid complex Lucide type issues in global types
  query: string;
  color?: string;
  subcategories: string[];
}

// Tipos para el comprador
export interface BuyerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: 'dni' | 'passport' | 'ruc';
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  notes?: string;
}

// Tipos para información de pago (placeholder para Stripe)
export interface PaymentInfo {
  cardholderName: string;
  // Los datos sensibles de la tarjeta serán manejados por Stripe
  billingAddress?: {
    sameAsShipping: boolean;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  paymentMethod: 'card' | 'transfer' | 'quote';
}

// Tipos para la reserva
export interface Reservation {
  id: string;
  projectId: string;
  project?: Project;
  buyerInfo: BuyerInfo;
  paymentInfo: PaymentInfo;
  status: ReservationStatus;
  type: ReservationType;
  totalAmount: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 
  | 'pending' 
  | 'processing' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

export type ReservationType = 
  | 'purchase' // Compra directa
  | 'quote';   // Solicitud de cotización

// Estado del flujo de checkout
export type CheckoutStep = 
  | 'project-selection' 
  | 'buyer-info' 
  | 'payment-info' 
  | 'review' 
  | 'confirmation';

export interface CheckoutState {
  currentStep: CheckoutStep;
  selectedProject: Project | null;
  buyerInfo: BuyerInfo | null;
  paymentInfo: PaymentInfo | null;
  reservationType: ReservationType;
  isLoading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
