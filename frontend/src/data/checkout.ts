import { Building2, User, CreditCard, ClipboardCheck, FileText } from 'lucide-react';
import type { CheckoutStep } from '../types';

export const checkoutSteps: { id: CheckoutStep; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'project-selection', label: 'Selección de Proyecto', shortLabel: 'Proyecto', icon: Building2 },
  { id: 'buyer-info', label: 'Información del Comprador', shortLabel: 'Datos', icon: User },
  { id: 'payment-info', label: 'Método de Pago', shortLabel: 'Pago', icon: CreditCard },
  { id: 'review', label: 'Confirmación', shortLabel: 'Confirmar', icon: ClipboardCheck },
];

export const paymentMethods = [
  {
    id: 'card',
    label: 'Tarjeta de Crédito',
    icon: CreditCard,
    description: 'Visa, Mastercard, AMEX',
    color: 'primary'
  },
  {
    id: 'transfer',
    label: 'Transferencia',
    icon: Building2,
    description: 'SPEI / Depósito',
    color: 'emerald'
  },
  {
    id: 'quote',
    label: 'Solo Cotización',
    icon: FileText,
    description: 'Sin compromiso',
    color: 'violet'
  },
];
