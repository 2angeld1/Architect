import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '../../store/checkoutStore';

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

  const { mutate: confirmReservation, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!acceptTerms) return;

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
      
      return data.reservationId;
    },
    onSuccess: (reservationId) => {
      if (!reservationId) return;
      resetCheckout();
      router.push(`/confirmacion/${reservationId}`);
    },
    onError: (error: any) => {
      console.error('Error al procesar la reserva:', error);
      alert(error.message || 'Error de red al procesar tu reserva. Inténtalo de nuevo.');
    }
  });

  const handleConfirmReservation = () => {
    if (!acceptTerms) return;
    confirmReservation();
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
