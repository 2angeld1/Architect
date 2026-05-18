import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '../store/checkoutStore';

export const useReviewOrder = () => {
  const router = useRouter();
  const { 
    selectedProject, 
    buyerInfo, 
    paymentInfo, 
    reservationType,
    prevStep, 
    goToStep,
    resetCheckout 
  } = useCheckoutStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getPaymentMethodLabel = () => {
    switch (paymentInfo?.paymentMethod) {
      case 'card':
        return 'Tarjeta de Crédito/Débito';
      case 'transfer':
        return 'Transferencia Bancaria';
      case 'quote':
        return 'Solicitud de Cotización';
      default:
        return 'No especificado';
    }
  };

  const handleConfirmReservation = async () => {
    if (!acceptTerms) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject?.id,
          buyerInfo,
          paymentInfo,
          reservationType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar tu reserva.');
      }
      
      const reservationId = data.reservationId;
      
      // Limpiar el checkout y navegar a confirmación
      resetCheckout();
      router.push(`/confirmacion/${reservationId}`);
    } catch (error: any) {
      console.error('Error al procesar la reserva:', error);
      alert(error.message || 'Error de red al procesar tu reserva. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedProject,
    buyerInfo,
    paymentInfo,
    reservationType,
    isSubmitting,
    acceptTerms,
    setAcceptTerms,
    formatPrice,
    getPaymentMethodLabel,
    handleConfirmReservation,
    prevStep,
    goToStep
  };
};
