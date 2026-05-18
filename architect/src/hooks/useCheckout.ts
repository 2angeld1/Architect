import { useEffect } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';

export const useCheckout = () => {
  const { currentStep, selectedProject, goToStep } = useCheckoutStore();

  useEffect(() => {
    if (!selectedProject && currentStep !== 'project-selection') {
      goToStep('project-selection');
    }
  }, [selectedProject, currentStep, goToStep]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const showSidebar = currentStep !== 'project-selection' && selectedProject;

  return {
    currentStep,
    selectedProject,
    goToStep,
    formatPrice,
    showSidebar
  };
};
