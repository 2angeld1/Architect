import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Building2, 
  User, 
  CreditCard, 
  MapPin, 
  Mail, 
  Phone,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';

const ReviewOrder = () => {
  const navigate = useNavigate();
  const { 
    selectedProject, 
    buyerInfo, 
    paymentInfo, 
    reservationType,
    prevStep, 
    goToStep,
    resetCheckout 
  } = useCheckoutStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getPaymentMethodLabel = () => {
    switch (paymentInfo?.paymentMethod) {
      case 'card':
        return 'Tarjeta de Crédito/Débito';
      case 'transfer':
        return 'Transferencia Bancaria';
      case 'quote':
        return 'Solicitud de Cotización';
      default:
        return 'No especificado';
    }
  };

  const handleConfirmReservation = async () => {
    if (!acceptTerms) return;
    
    setIsSubmitting(true);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar ID de reserva mock
      const reservationId = `RES-${Date.now()}`;
      
      // Limpiar el checkout y navegar a confirmación
      resetCheckout();
      navigate(`/confirmacion/${reservationId}`);
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProject || !buyerInfo || !paymentInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">
          Faltan datos para completar la revisión. Por favor, completa todos los pasos.
        </p>
        <button
          onClick={() => goToStep('project-selection')}
          className="btn-primary mt-4"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-secondary-800 mb-2">
          Revisión de la Reserva
        </h2>
        <p className="text-secondary-600">
          Verifica que toda la información sea correcta antes de confirmar.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Summary */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-secondary-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Proyecto Seleccionado
            </h3>
            <button
              onClick={() => goToStep('project-selection')}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>

          <div className="flex gap-4">
            <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-12 h-12 text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-lg text-secondary-800">
                {selectedProject.name}
              </h4>
              <p className="text-secondary-500 text-sm mb-2">
                {selectedProject.category} • {selectedProject.area}m² • {selectedProject.rooms} habitaciones
              </p>
              <p className="text-secondary-600 text-sm line-clamp-2">
                {selectedProject.description}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-between items-center">
            <span className="text-secondary-600">
              {reservationType === 'quote' ? 'Cotización' : 'Precio del plano'}
            </span>
            <span className="text-xl font-bold text-primary-600">
              {reservationType === 'quote' 
                ? 'Por confirmar' 
                : formatPrice(selectedProject.price, selectedProject.currency)
              }
            </span>
          </div>
        </div>

        {/* Buyer Info Summary */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-secondary-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Información del Comprador
            </h3>
            <button
              onClick={() => goToStep('buyer-info')}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-xs text-secondary-500">Nombre completo</p>
                <p className="text-secondary-800">{buyerInfo.firstName} {buyerInfo.lastName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-xs text-secondary-500">Email</p>
                <p className="text-secondary-800">{buyerInfo.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-xs text-secondary-500">Teléfono</p>
                <p className="text-secondary-800">{buyerInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-xs text-secondary-500">Documento</p>
                <p className="text-secondary-800">
                  {buyerInfo.documentType.toUpperCase()}: {buyerInfo.documentNumber}
                </p>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-xs text-secondary-500">Dirección</p>
                <p className="text-secondary-800">
                  {buyerInfo.address}, {buyerInfo.city}, {buyerInfo.state} {buyerInfo.postalCode}, {buyerInfo.country}
                </p>
              </div>
            </div>

            {buyerInfo.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs text-secondary-500">Notas</p>
                <p className="text-secondary-600 text-sm">{buyerInfo.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info Summary */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-secondary-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-600" />
              Método de Pago
            </h3>
            <button
              onClick={() => goToStep('payment-info')}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>

          <div className="flex items-center gap-3">
            {paymentInfo.paymentMethod === 'card' && (
              <CreditCard className="w-8 h-8 text-primary-600" />
            )}
            {paymentInfo.paymentMethod === 'transfer' && (
              <Building2 className="w-8 h-8 text-primary-600" />
            )}
            {paymentInfo.paymentMethod === 'quote' && (
              <FileText className="w-8 h-8 text-primary-600" />
            )}
            <div>
              <p className="font-medium text-secondary-800">{getPaymentMethodLabel()}</p>
              {paymentInfo.cardholderName && (
                <p className="text-secondary-500 text-sm">Titular: {paymentInfo.cardholderName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="card p-6 bg-primary-50 border-primary-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-secondary-600">Total a pagar</p>
              <p className="text-xs text-secondary-500">Impuestos incluidos</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">
                {reservationType === 'quote' 
                  ? 'Pendiente' 
                  : formatPrice(selectedProject.price, selectedProject.currency)
                }
              </p>
              {reservationType === 'quote' && (
                <p className="text-xs text-secondary-500">Se enviará cotización por email</p>
              )}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="card p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 mt-0.5"
            />
            <span className="text-secondary-600 text-sm">
              Acepto los{' '}
              <a href="#" className="text-primary-600 hover:underline">Términos y Condiciones</a>
              {' '}y la{' '}
              <a href="#" className="text-primary-600 hover:underline">Política de Privacidad</a>.
              Entiendo que esta es una reserva de planos arquitectónicos digitales.
            </span>
          </label>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={prevStep}
            className="btn-secondary flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          
          <button
            onClick={handleConfirmReservation}
            disabled={!acceptTerms || isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {reservationType === 'quote' ? 'Solicitar Cotización' : 'Confirmar Reserva'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;
