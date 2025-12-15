import { Check } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import type { CheckoutStep } from '../../types';

const steps: { id: CheckoutStep; label: string; shortLabel: string }[] = [
  { id: 'project-selection', label: 'Selección de Proyecto', shortLabel: 'Proyecto' },
  { id: 'buyer-info', label: 'Información del Comprador', shortLabel: 'Comprador' },
  { id: 'payment-info', label: 'Información de Pago', shortLabel: 'Pago' },
  { id: 'review', label: 'Revisión', shortLabel: 'Revisión' },
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
    <nav className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = isStepCompleted(step.id);
          const isPast = index < currentIndex;
          const canNavigate = canNavigateToStep(index);
          
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
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100' 
                      : isCompleted || isPast
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-200 text-secondary-500'
                    }
                    ${canNavigate && !isActive ? 'group-hover:ring-2 group-hover:ring-primary-200' : ''}
                  `}
                >
                  {isCompleted || isPast ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Step label */}
                <span
                  className={`
                    mt-2 text-xs font-medium hidden sm:block
                    ${isActive 
                      ? 'text-primary-600' 
                      : isPast || isCompleted
                        ? 'text-secondary-600'
                        : 'text-secondary-400'
                    }
                  `}
                >
                  {step.label}
                </span>
                <span
                  className={`
                    mt-2 text-xs font-medium sm:hidden
                    ${isActive 
                      ? 'text-primary-600' 
                      : isPast || isCompleted
                        ? 'text-secondary-600'
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
                    absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5
                    ${isPast || isCompleted ? 'bg-primary-600' : 'bg-secondary-200'}
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
