import { useState } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';
import type { PaymentInfo } from '../types';

export const usePaymentInfo = () => {
  const { paymentInfo, setPaymentInfo, nextStep, prevStep, reservationType } = useCheckoutStore();
  
  const [formData, setFormData] = useState<PaymentInfo>(paymentInfo || {
    cardholderName: '',
    paymentMethod: reservationType === 'quote' ? 'quote' : 'card',
    billingAddress: {
      sameAsShipping: true,
    },
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (name.startsWith('billing.')) {
      const field = name.replace('billing.', '');

      setFormData((prev) => {
        const prevBilling = prev.billingAddress ?? { sameAsShipping: true };

        const updatedBilling: NonNullable<PaymentInfo['billingAddress']> =
          field === 'sameAsShipping'
            ? { ...prevBilling, sameAsShipping: !!checked }
            : { ...prevBilling, [field]: value } as NonNullable<PaymentInfo['billingAddress']>;

        return { ...prev, billingAddress: updatedBilling } as PaymentInfo;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value } as PaymentInfo));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePaymentMethodChange = (method: 'card' | 'transfer' | 'quote') => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (formData.paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'El nombre del titular es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setPaymentInfo(formData);
      nextStep();
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handlePaymentMethodChange,
    handleSubmit,
    prevStep,
    reservationType
  };
};
