import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Project, 
  BuyerInfo, 
  PaymentInfo, 
  CheckoutStep, 
  ReservationType 
} from '../types';

interface CheckoutStore {
  // Estado
  currentStep: CheckoutStep;
  selectedProject: Project | null;
  buyerInfo: BuyerInfo | null;
  paymentInfo: PaymentInfo | null;
  reservationType: ReservationType;
  
  // Acciones
  setCurrentStep: (step: CheckoutStep) => void;
  selectProject: (project: Project) => void;
  clearProject: () => void;
  setBuyerInfo: (info: BuyerInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  setReservationType: (type: ReservationType) => void;
  
  // Navegación
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: CheckoutStep) => void;
  
  // Reset
  resetCheckout: () => void;
  
  // Helpers
  canProceedToNextStep: () => boolean;
  getStepIndex: () => number;
}

const STEPS_ORDER: CheckoutStep[] = [
  'project-selection',
  'buyer-info',
  'payment-info',
  'review',
  'confirmation'
];

const initialState = {
  currentStep: 'project-selection' as CheckoutStep,
  selectedProject: null,
  buyerInfo: null,
  paymentInfo: null,
  reservationType: 'purchase' as ReservationType,
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      selectProject: (project) => set({ selectedProject: project }),
      
      clearProject: () => set({ selectedProject: null }),
      
      setBuyerInfo: (info) => set({ buyerInfo: info }),
      
      setPaymentInfo: (info) => set({ paymentInfo: info }),
      
      setReservationType: (type) => set({ reservationType: type }),
      
      nextStep: () => {
        const { currentStep, selectedProject, reservationType } = get();
        const currentIndex = STEPS_ORDER.indexOf(currentStep);
        
        if (currentIndex < STEPS_ORDER.length - 1) {
          let nextStepIndex = currentIndex + 1;
          
          // Si es cotización y ya hay proyecto, saltar selección
          if (reservationType === 'quote' && selectedProject && currentIndex === 0) {
            // Ya tiene proyecto, continuar normalmente
          }
          
          set({ currentStep: STEPS_ORDER[nextStepIndex] });
        }
      },
      
      prevStep: () => {
        const { currentStep } = get();
        const currentIndex = STEPS_ORDER.indexOf(currentStep);
        
        if (currentIndex > 0) {
          set({ currentStep: STEPS_ORDER[currentIndex - 1] });
        }
      },
      
      goToStep: (step) => {
        const { currentStep, selectedProject, buyerInfo, paymentInfo } = get();
        const targetIndex = STEPS_ORDER.indexOf(step);
        const currentIndex = STEPS_ORDER.indexOf(currentStep);
        
        // Solo permitir ir hacia atrás libremente
        // Para ir hacia adelante, verificar que se hayan completado los pasos anteriores
        if (targetIndex <= currentIndex) {
          set({ currentStep: step });
          return;
        }
        
        // Verificar requisitos para ir hacia adelante
        if (targetIndex >= 1 && !selectedProject) return;
        if (targetIndex >= 2 && !buyerInfo) return;
        if (targetIndex >= 3 && !paymentInfo) return;
        
        set({ currentStep: step });
      },
      
      resetCheckout: () => set(initialState),
      
      canProceedToNextStep: () => {
        const { currentStep, selectedProject, buyerInfo, paymentInfo } = get();
        
        switch (currentStep) {
          case 'project-selection':
            return selectedProject !== null;
          case 'buyer-info':
            return buyerInfo !== null;
          case 'payment-info':
            return paymentInfo !== null;
          case 'review':
            return true;
          default:
            return false;
        }
      },
      
      getStepIndex: () => {
        const { currentStep } = get();
        return STEPS_ORDER.indexOf(currentStep);
      },
    }),
    {
      name: 'archiquect-checkout',
      partialize: (state) => ({
        selectedProject: state.selectedProject,
        buyerInfo: state.buyerInfo,
        paymentInfo: state.paymentInfo,
        reservationType: state.reservationType,
        currentStep: state.currentStep,
      }),
    }
  )
);
