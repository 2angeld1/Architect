import { useState } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';
import type { BuyerInfo } from '../types';

export const useBuyerInfo = () => {
  const { buyerInfo, setBuyerInfo, nextStep, prevStep } = useCheckoutStore();
  
  const [formData, setFormData] = useState<BuyerInfo>(buyerInfo || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentType: 'dni',
    documentNumber: '',
    address: '',
    city: '',
    state: '',
    country: 'México',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BuyerInfo, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name as keyof BuyerInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BuyerInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es requerido';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'El estado/provincia es requerido';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setBuyerInfo(formData);
      nextStep();
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    prevStep
  };
};
