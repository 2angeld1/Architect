import { User, MapPin, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBuyerInfo } from '../../hooks/useBuyerInfo';
import Reveal from '../ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';
import FormInput from '../ui/FormInput';

const BuyerInfoForm = () => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    prevStep
  } = useBuyerInfo();

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
              <FormInput
                label="Nombre *"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Juan"
              />
              <FormInput
                label="Apellido *"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Pérez"
              />
              <FormInput
                label="Email *"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="juan@ejemplo.com"
              />
              <FormInput
                label="Teléfono *"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+52 55 1234 5678"
              />
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
              <div className="space-y-2">
                <label htmlFor="documentType" className="flex items-center gap-2 text-sm font-bold text-secondary-700 ml-1">
                  Tipo de Documento *
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 bg-secondary-50/50 border-secondary-200 focus:border-primary-500 transition-all outline-none"
                >
                  <option value="dni">DNI / INE</option>
                  <option value="passport">Pasaporte</option>
                  <option value="ruc">RFC / RUC</option>
                </select>
              </div>

              <FormInput
                label="Número de Documento *"
                id="documentNumber"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                error={errors.documentNumber}
                placeholder="XXXX123456"
              />
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
              <FormInput
                label="Dirección *"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Calle Principal 123, Col. Centro"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Ciudad *"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Ciudad de México"
                />
                <FormInput
                  label="Estado / Provincia *"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="CDMX"
                />
                <FormInput
                  label="País"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="México"
                />
                <FormInput
                  label="Código Postal *"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  placeholder="06600"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Notes */}
        <Reveal variants={slideUp} delay={0.4}>
          <FormInput
            label="Notas adicionales (opcional)"
            isTextArea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="¿Algún comentario o requerimiento especial?"
          />
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
