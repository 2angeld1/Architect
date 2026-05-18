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
    documentNumber: '00000000',
    address: 'Entrega Digital',
    city: 'Digital',
    state: 'Digital',
    country: 'México',
    postalCode: '00000',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BuyerInfo, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando se modifica el campo
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

    // Nota: Eliminamos tanto la dirección física como la identificación oficial (DNI/INE/RUC)
    // para tener un checkout lo más rápido y libre de fricción posible.

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
