import { useEffect } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import ProjectSelection from '../components/checkout/ProjectSelection';
import BuyerInfoForm from '../components/checkout/BuyerInfoForm';
import PaymentInfoForm from '../components/checkout/PaymentInfoForm';
import ReviewOrder from '../components/checkout/ReviewOrder';

const CheckoutPage = () => {
  const { currentStep, selectedProject, goToStep } = useCheckoutStore();

  // Si no hay proyecto seleccionado y no estamos en el primer paso, redirigir
  useEffect(() => {
    if (!selectedProject && currentStep !== 'project-selection') {
      goToStep('project-selection');
    }
  }, [selectedProject, currentStep, goToStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'project-selection':
        return <ProjectSelection />;
      case 'buyer-info':
        return <BuyerInfoForm />;
      case 'payment-info':
        return <PaymentInfoForm />;
      case 'review':
        return <ReviewOrder />;
      default:
        return <ProjectSelection />;
    }
  };

  return (
    <div className="py-8 lg:py-12 bg-secondary-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper */}
        {currentStep !== 'confirmation' && (
          <CheckoutStepper />
        )}

        {/* Step Content */}
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
