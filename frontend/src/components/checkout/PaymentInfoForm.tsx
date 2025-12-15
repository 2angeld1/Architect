import { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Building2, FileText, Lock } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import type { PaymentInfo } from '../../types';

const PaymentInfoForm = () => {
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-secondary-800 mb-2">
          Información de Pago
        </h2>
        <p className="text-secondary-600">
          {reservationType === 'quote' 
            ? 'Has solicitado una cotización. Confirma el método de contacto.' 
            : 'Selecciona tu método de pago preferido.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="card p-6">
          <h3 className="font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-100">
            Método de Pago
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card Payment */}
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('card')}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${formData.paymentMethod === 'card' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-secondary-200 hover:border-primary-300'
                }
              `}
            >
              <CreditCard className={`w-8 h-8 ${
                formData.paymentMethod === 'card' ? 'text-primary-600' : 'text-secondary-400'
              }`} />
              <span className={`font-medium text-sm ${
                formData.paymentMethod === 'card' ? 'text-primary-600' : 'text-secondary-600'
              }`}>
                Tarjeta
              </span>
            </button>

            {/* Bank Transfer */}
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('transfer')}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${formData.paymentMethod === 'transfer' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-secondary-200 hover:border-primary-300'
                }
              `}
            >
              <Building2 className={`w-8 h-8 ${
                formData.paymentMethod === 'transfer' ? 'text-primary-600' : 'text-secondary-400'
              }`} />
              <span className={`font-medium text-sm ${
                formData.paymentMethod === 'transfer' ? 'text-primary-600' : 'text-secondary-600'
              }`}>
                Transferencia
              </span>
            </button>

            {/* Quote Request */}
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('quote')}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${formData.paymentMethod === 'quote' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-secondary-200 hover:border-primary-300'
                }
              `}
            >
              <FileText className={`w-8 h-8 ${
                formData.paymentMethod === 'quote' ? 'text-primary-600' : 'text-secondary-400'
              }`} />
              <span className={`font-medium text-sm ${
                formData.paymentMethod === 'quote' ? 'text-primary-600' : 'text-secondary-600'
              }`}>
                Cotización
              </span>
            </button>
          </div>
        </div>

        {/* Card Payment Form */}
        {formData.paymentMethod === 'card' && (
          <div className="card p-6">
            <h3 className="font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-100">
              Datos de la Tarjeta
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="cardholderName" className="label">
                  Nombre del Titular *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  className={errors.cardholderName ? 'input-error' : 'input'}
                  placeholder="Como aparece en la tarjeta"
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
                )}
              </div>

              {/* Stripe Elements Placeholder */}
              <div className="p-4 bg-secondary-50 rounded-lg border border-dashed border-secondary-300">
                <div className="flex items-center gap-2 text-secondary-500 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Pago seguro con Stripe</span>
                </div>
                <p className="text-xs text-secondary-400">
                  Los campos de tarjeta de crédito se renderizarán aquí usando Stripe Elements
                  para garantizar la seguridad de tus datos.
                </p>
                
                {/* Mock card input fields for visualization */}
                <div className="mt-4 space-y-3">
                  <div className="bg-white p-3 rounded border border-secondary-200">
                    <span className="text-secondary-400 text-sm">Número de tarjeta</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-secondary-200">
                      <span className="text-secondary-400 text-sm">MM/AA</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-secondary-200">
                      <span className="text-secondary-400 text-sm">CVC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Payment Info */}
        {formData.paymentMethod === 'transfer' && (
          <div className="card p-6">
            <h3 className="font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-100">
              Información para Transferencia
            </h3>

            <div className="bg-primary-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-secondary-600">Banco:</p>
                <p className="font-medium text-secondary-800">BBVA México</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Titular:</p>
                <p className="font-medium text-secondary-800">Archiquect S.A. de C.V.</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">CLABE:</p>
                <p className="font-medium text-secondary-800">0123 4567 8901 2345 67</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Referencia:</p>
                <p className="font-medium text-secondary-800">Se generará al confirmar</p>
              </div>
            </div>

            <p className="text-sm text-secondary-500 mt-4">
              Una vez realizada la transferencia, envía el comprobante a pagos@archiquect.com
              para activar tu pedido.
            </p>
          </div>
        )}

        {/* Quote Request Info */}
        {formData.paymentMethod === 'quote' && (
          <div className="card p-6">
            <h3 className="font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-100">
              Solicitud de Cotización
            </h3>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800">
                Al confirmar, recibirás una cotización personalizada en tu correo electrónico
                dentro de las próximas 24-48 horas hábiles. Un asesor se pondrá en contacto
                contigo para discutir los detalles del proyecto.
              </p>
            </div>
          </div>
        )}

        {/* Billing Address */}
        {formData.paymentMethod === 'card' && (
          <div className="card p-6">
            <h3 className="font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-100">
              Dirección de Facturación
            </h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="billing.sameAsShipping"
                checked={formData.billingAddress?.sameAsShipping}
                onChange={handleChange}
                className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-secondary-700">
                Usar la misma dirección que ingresé anteriormente
              </span>
            </label>

            {!formData.billingAddress?.sameAsShipping && (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="billing.address" className="label">Dirección</label>
                  <input
                    type="text"
                    id="billing.address"
                    name="billing.address"
                    value={formData.billingAddress?.address || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="Calle y número"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing.city" className="label">Ciudad</label>
                    <input
                      type="text"
                      id="billing.city"
                      name="billing.city"
                      value={formData.billingAddress?.city || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="billing.postalCode" className="label">Código Postal</label>
                    <input
                      type="text"
                      id="billing.postalCode"
                      name="billing.postalCode"
                      value={formData.billingAddress?.postalCode || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security notice */}
        <div className="flex items-center gap-2 text-secondary-500 text-sm justify-center">
          <Lock className="w-4 h-4" />
          <span>Tus datos están protegidos con encriptación SSL</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            Revisar Pedido
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentInfoForm;
