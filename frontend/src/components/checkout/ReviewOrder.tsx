import { Building2, CreditCard, FileText, User, Mail, Phone, MapPin, Clock, ShieldCheck, Edit2, CheckCircle, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { useReviewOrder } from '../../hooks/useReviewOrder';
import Reveal from '../ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';

const ReviewOrder = () => {
  const {
    selectedProject,
    buyerInfo,
    paymentInfo,
    reservationType,
    isSubmitting,
    acceptTerms,
    setAcceptTerms,
    formatPrice,
    getPaymentMethodLabel,
    handleConfirmReservation,
    prevStep,
    goToStep
  } = useReviewOrder();

  const getPaymentIcon = () => {
    switch (paymentInfo?.paymentMethod) {
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'transfer':
        return <Building2 className="w-6 h-6" />;
      case 'quote':
        return <FileText className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  if (!selectedProject || !buyerInfo || !paymentInfo) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-secondary-400" />
        </div>
        <h3 className="text-lg font-bold text-secondary-800 mb-2">Información incompleta</h3>
        <p className="text-secondary-500 mb-6">
          Faltan datos para completar la revisión. Por favor, completa todos los pasos.
        </p>
        <button
          onClick={() => goToStep('project-selection')}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Reveal variants={fadeIn}>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Último paso
          </div>
          <h2 className="font-heading text-2xl font-bold text-secondary-900 mb-2">
            Revisa tu Pedido
          </h2>
          <p className="text-secondary-500">
            Verifica que toda la información sea correcta antes de confirmar.
          </p>
        </div>
      </Reveal>

      <div className="space-y-6">
        {/* Project Summary */}
        <Reveal variants={slideUp} delay={0.1}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-secondary-900">Proyecto Seleccionado</h3>
              </div>
              <button
                onClick={() => goToStep('project-selection')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1.5 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Cambiar
              </button>
            </div>

            <div className="flex gap-5 bg-white rounded-xl p-4 border border-secondary-100">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full capitalize">
                  {selectedProject.category}
                </span>
                <h4 className="font-heading font-bold text-lg text-secondary-900 mt-2">
                  {selectedProject.name}
                </h4>
                <p className="text-secondary-500 text-sm mb-2">
                  {selectedProject.area}m² • {selectedProject.rooms} habitaciones • {selectedProject.bathrooms} baños
                </p>
                <p className="text-secondary-600 text-sm line-clamp-2">
                  {selectedProject.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200 flex justify-between items-center">
              <span className="text-secondary-600">
                {reservationType === 'quote' ? 'Cotización' : 'Precio del plano'}
              </span>
              <span className="text-2xl font-bold text-primary-600">
                {reservationType === 'quote'
                  ? 'Por confirmar'
                  : formatPrice(selectedProject.price, selectedProject.currency)
                }
              </span>
            </div>
          </div>
        </Reveal>

        {/* Buyer Info Summary */}
        <Reveal variants={slideUp} delay={0.2}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-secondary-900">Información del Comprador</h3>
              </div>
              <button
                onClick={() => goToStep('buyer-info')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1.5 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded-xl p-4 border border-secondary-100">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-secondary-400 mt-1" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Nombre</p>
                  <p className="font-medium text-secondary-900">{buyerInfo.firstName} {buyerInfo.lastName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-secondary-400 mt-1" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Email</p>
                  <p className="font-medium text-secondary-900">{buyerInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-secondary-400 mt-1" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Teléfono</p>
                  <p className="font-medium text-secondary-900">{buyerInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-secondary-400 mt-1" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Documento</p>
                  <p className="font-medium text-secondary-900">
                    {buyerInfo.documentType.toUpperCase()}: {buyerInfo.documentNumber}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary-400 mt-1" />
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Dirección</p>
                  <p className="font-medium text-secondary-900">
                    {buyerInfo.address}, {buyerInfo.city}, {buyerInfo.state} {buyerInfo.postalCode}, {buyerInfo.country}
                  </p>
                </div>
              </div>

              {buyerInfo.notes && (
                <div className="sm:col-span-2 pt-3 border-t border-secondary-100">
                  <p className="text-xs text-secondary-400 uppercase tracking-wide mb-1">Notas</p>
                  <p className="text-secondary-600 text-sm">{buyerInfo.notes}</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Payment Info Summary */}
        <Reveal variants={slideUp} delay={0.3}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-secondary-900">Método de Pago</h3>
              </div>
              <button
                onClick={() => goToStep('payment-info')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1.5 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Cambiar
              </button>
            </div>

            <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-secondary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                {getPaymentIcon()}
              </div>
              <div>
                <p className="font-semibold text-secondary-900">{getPaymentMethodLabel()}</p>
                {paymentInfo.cardholderName && (
                  <p className="text-secondary-500 text-sm">Titular: {paymentInfo.cardholderName}</p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Order Total */}
        <Reveal variants={slideUp} delay={0.4}>
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-primary-200">Total a pagar</p>
                <p className="text-sm text-primary-200">Impuestos incluidos</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {reservationType === 'quote'
                    ? 'Pendiente'
                    : formatPrice(selectedProject.price, selectedProject.currency)
                  }
                </p>
                {reservationType === 'quote' && (
                  <p className="text-sm text-primary-200 flex items-center gap-1 justify-end mt-1">
                    <Clock className="w-4 h-4" />
                    Cotización en 24-48h
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Benefits */}
        <Reveal variants={fadeIn} delay={0.5}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-secondary-100">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-secondary-600">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-secondary-100">
              <Clock className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-secondary-600">Entrega inmediata</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-secondary-100">
              <FileText className="w-5 h-5 text-violet-500" />
              <span className="text-sm text-secondary-600">Factura incluida</span>
            </div>
          </div>
        </Reveal>

        {/* Terms and Conditions */}
        <Reveal variants={fadeIn} delay={0.6}>
          <div className="bg-white rounded-xl p-5 border border-secondary-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 rounded-md border-secondary-300 text-primary-600 focus:ring-primary-500 mt-0.5"
              />
              <span className="text-secondary-600 text-sm leading-relaxed">
                Acepto los{' '}
                <a href="#" className="text-primary-600 hover:underline font-medium">Términos y Condiciones</a>
                {' '}y la{' '}
                <a href="#" className="text-primary-600 hover:underline font-medium">Política de Privacidad</a>.
                Entiendo que esta es una compra de planos arquitectónicos digitales.
              </span>
            </label>
          </div>
        </Reveal>

        {/* Navigation buttons */}
        <Reveal variants={fadeIn} delay={0.7}>
          <div className="flex justify-between pt-6 border-t border-secondary-100">
            <button
              onClick={prevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={handleConfirmReservation}
              disabled={!acceptTerms || isSubmitting}
              className="flex items-center gap-2 px-10 py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-primary-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {reservationType === 'quote' ? 'Solicitar Cotización' : 'Confirmar Compra'}
                </>
              )}
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default ReviewOrder;
