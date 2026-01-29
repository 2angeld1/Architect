import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckoutStore } from '../store/checkoutStore';

export const useReviewOrder = () => {
  const navigate = useNavigate();
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
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar ID de reserva mock
      const reservationId = `RES-${Date.now()}`;
      
      // Limpiar el checkout y navegar a confirmación
      resetCheckout();
      navigate(`/confirmacion/${reservationId}`);
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
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
