import { useEffect } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import ProjectSelection from '../components/checkout/ProjectSelection';
import BuyerInfoForm from '../components/checkout/BuyerInfoForm';
import PaymentInfoForm from '../components/checkout/PaymentInfoForm';
import ReviewOrder from '../components/checkout/ReviewOrder';
import { ShieldCheck, Truck, CreditCard, Building2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CheckoutPage = () => {
  const { currentStep, selectedProject, goToStep } = useCheckoutStore();

  // Si no hay proyecto seleccionado y no estamos en el primer paso, redirigir
  useEffect(() => {
    if (!selectedProject && currentStep !== 'project-selection') {
      goToStep('project-selection');
    }
  }, [selectedProject, currentStep, goToStep]);

  const renderStep = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {(() => {
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
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const showSidebar = currentStep !== 'project-selection' && selectedProject;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-100 to-secondary-50">
      {/* Header */}
      <div className="bg-secondary-900 text-white pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-2">
              {currentStep === 'project-selection' ? 'Selecciona tu Proyecto' : 'Proceso de Compra'}
            </h1>
            <p className="text-secondary-300">
              {currentStep === 'project-selection'
                ? 'Elige el diseño arquitectónico perfecto para tu hogar'
                : 'Completa los siguientes pasos para finalizar tu compra'
              }
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Stepper */}
        {currentStep !== 'project-selection' && currentStep !== 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-6 mb-8"
          >
            <CheckoutStepper />
          </motion.div>
        )}

        {/* Main Content */}
        <div className={`${showSidebar ? 'lg:grid lg:grid-cols-3 lg:gap-8' : ''}`}>
          {/* Form Area */}
          <div className={`${showSidebar ? 'lg:col-span-2' : ''}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 overflow-hidden">
              <div className="p-6 lg:p-8">
                {renderStep()}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 lg:mt-0"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-6 sticky top-24">
                <h3 className="font-heading font-bold text-secondary-900 mb-4 pb-4 border-b border-secondary-100">
                  Resumen del Pedido
                </h3>

                {/* Project Preview */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-secondary-900 truncate">
                      {selectedProject.name}
                    </h4>
                    <p className="text-sm text-secondary-500 capitalize">
                      {selectedProject.category}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {selectedProject.area}m² • {selectedProject.rooms} hab.
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-secondary-100">
                  <div className="flex justify-between text-secondary-600">
                    <span>Planos arquitectónicos</span>
                    <span>{formatPrice(selectedProject.price, selectedProject.currency)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600">
                    <span>Descuento</span>
                    <span className="text-emerald-600">-$0.00</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-secondary-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(selectedProject.price, selectedProject.currency)}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t border-secondary-100">
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <Truck className="w-5 h-5 text-primary-500" />
                    <span>Entrega digital inmediata</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <CreditCard className="w-5 h-5 text-violet-500" />
                    <span>Múltiples métodos de pago</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
};

export default CheckoutPage;
