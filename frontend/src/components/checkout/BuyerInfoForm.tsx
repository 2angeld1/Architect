import { useState } from 'react';
import { ArrowLeft, ArrowRight, User, MapPin, FileText } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import type { BuyerInfo } from '../../types';
import Reveal from '../ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';

const BuyerInfoForm = () => {
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

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl border-2 bg-secondary-50/50 
    transition-all duration-200 outline-none
    ${hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
      : 'border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
    }
  `;

  const labelClasses = "block text-sm font-medium text-secondary-700 mb-1.5";

  return (
    <div className="space-y-8">
      {/* Header */}
      <Reveal variants={fadeIn}>
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-secondary-900 mb-2">
            Información del Comprador
          </h2>
          <p className="text-secondary-500">
            Ingresa tus datos para procesar la compra del proyecto.
          </p>
        </div>
      </Reveal>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info Section */}
        <Reveal variants={slideUp} delay={0.1}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Datos Personales</h3>
                <p className="text-sm text-secondary-500">Información de contacto</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className={labelClasses}>Nombre *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClasses(!!errors.firstName)}
                  placeholder="Juan"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className={labelClasses}>Apellido *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClasses(!!errors.lastName)}
                  placeholder="Pérez"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses(!!errors.email)}
                  placeholder="juan@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelClasses}>Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses(!!errors.phone)}
                  placeholder="+52 55 1234 5678"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Document Section */}
        <Reveal variants={slideUp} delay={0.2}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Identificación</h3>
                <p className="text-sm text-secondary-500">Documento oficial</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="documentType" className={labelClasses}>Tipo de Documento *</label>
                <select
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className={inputClasses(false)}
                >
                  <option value="dni">DNI / INE</option>
                  <option value="passport">Pasaporte</option>
                  <option value="ruc">RFC / RUC</option>
                </select>
              </div>

              <div>
                <label htmlFor="documentNumber" className={labelClasses}>Número de Documento *</label>
                <input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className={inputClasses(!!errors.documentNumber)}
                  placeholder="XXXX123456"
                />
                {errors.documentNumber && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.documentNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Address Section */}
        <Reveal variants={slideUp} delay={0.3}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Dirección</h3>
                <p className="text-sm text-secondary-500">Ubicación de entrega</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="address" className={labelClasses}>Dirección *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClasses(!!errors.address)}
                  placeholder="Calle Principal 123, Col. Centro"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="city" className={labelClasses}>Ciudad *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClasses(!!errors.city)}
                    placeholder="Ciudad de México"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className={labelClasses}>Estado / Provincia *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={inputClasses(!!errors.state)}
                    placeholder="CDMX"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className={labelClasses}>País</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClasses(false)}
                    placeholder="México"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className={labelClasses}>Código Postal *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={inputClasses(!!errors.postalCode)}
                    placeholder="06600"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Notes */}
        <Reveal variants={slideUp} delay={0.4}>
          <div>
            <label htmlFor="notes" className={labelClasses}>Notas adicionales (opcional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses(false)} resize-none`}
              placeholder="¿Algún comentario o requerimiento especial?"
            />
          </div>
        </Reveal>

        {/* Navigation buttons */}
        <Reveal variants={fadeIn} delay={0.5}>
          <div className="flex justify-between pt-6 border-t border-secondary-100">
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>
      </form>
    </div>
  );
};

export default BuyerInfoForm;
