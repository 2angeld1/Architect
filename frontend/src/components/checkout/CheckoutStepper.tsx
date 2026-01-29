import { Check, Building2, User, CreditCard, ClipboardCheck } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import type { CheckoutStep } from '../../types';

const steps: { id: CheckoutStep; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'project-selection', label: 'Selección de Proyecto', shortLabel: 'Proyecto', icon: Building2 },
  { id: 'buyer-info', label: 'Información del Comprador', shortLabel: 'Datos', icon: User },
  { id: 'payment-info', label: 'Método de Pago', shortLabel: 'Pago', icon: CreditCard },
  { id: 'review', label: 'Confirmación', shortLabel: 'Confirmar', icon: ClipboardCheck },
];

const CheckoutStepper = () => {
  const { currentStep, goToStep, selectedProject, buyerInfo, paymentInfo } = useCheckoutStore();
  
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  
  const isStepCompleted = (stepId: CheckoutStep) => {
    switch (stepId) {
      case 'project-selection':
        return selectedProject !== null;
      case 'buyer-info':
        return buyerInfo !== null;
      case 'payment-info':
        return paymentInfo !== null;
      case 'review':
        return currentStep === 'confirmation';
      default:
        return false;
    }
  };
  
  const canNavigateToStep = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    if (stepIndex === 1) return selectedProject !== null;
    if (stepIndex === 2) return selectedProject !== null && buyerInfo !== null;
    if (stepIndex === 3) return selectedProject !== null && buyerInfo !== null && paymentInfo !== null;
    return false;
  };

  return (
    <nav>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = isStepCompleted(step.id);
          const isPast = index < currentIndex;
          const canNavigate = canNavigateToStep(index);
          const Icon = step.icon;
          
          return (
            <li key={step.id} className="flex-1 relative">
              <button
                onClick={() => canNavigate && goToStep(step.id)}
                disabled={!canNavigate}
                className={`
                  w-full flex flex-col items-center group
                  ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {/* Step circle */}
                <div
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center
                    font-semibold text-sm transition-all duration-300
                    ${isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-110' 
                      : isCompleted || isPast
                      ? 'bg-emerald-500 text-white'
                      : 'bg-secondary-100 text-secondary-400'
                    }
                    ${canNavigate && !isActive ? 'group-hover:scale-105 group-hover:shadow-md' : ''}
                  `}
                >
                  {isCompleted || isPast ? (
                    <Check className="w-5 h-5" />
                  ) : (
                      <Icon className="w-5 h-5" />
                  )}
                </div>
                
                {/* Step label */}
                <span
                  className={`
                    mt-3 text-sm font-medium hidden sm:block transition-colors
                    ${isActive 
                      ? 'text-primary-600' 
                      : isPast || isCompleted
                      ? 'text-secondary-700'
                        : 'text-secondary-400'
                    }
                  `}
                >
                  {step.label}
                </span>
                <span
                  className={`
                    mt-3 text-xs font-medium sm:hidden transition-colors
                    ${isActive 
                      ? 'text-primary-600' 
                      : isPast || isCompleted
                      ? 'text-secondary-700'
                        : 'text-secondary-400'
                    }
                  `}
                >
                  {step.shortLabel}
                </span>
              </button>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute top-6 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-1 rounded-full
                    transition-colors duration-300
                    ${isPast || isCompleted ? 'bg-emerald-500' : 'bg-secondary-100'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutStepper;
