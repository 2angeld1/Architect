import { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Building2, FileText, Lock, ShieldCheck, Wallet } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import type { PaymentInfo } from '../../types';
import Reveal from '../ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';

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

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl border-2 bg-secondary-50/50 
    transition-all duration-200 outline-none
    ${hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
      : 'border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
    }
  `;

  const paymentMethods = [
    {
      id: 'card',
      label: 'Tarjeta de Crédito',
      icon: CreditCard,
      description: 'Visa, Mastercard, AMEX',
      color: 'primary'
    },
    {
      id: 'transfer',
      label: 'Transferencia',
      icon: Building2,
      description: 'SPEI / Depósito',
      color: 'emerald'
    },
    {
      id: 'quote',
      label: 'Solo Cotización',
      icon: FileText,
      description: 'Sin compromiso',
      color: 'violet'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Reveal variants={fadeIn}>
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-secondary-900 mb-2">
            Método de Pago
          </h2>
          <p className="text-secondary-500">
            {reservationType === 'quote'
              ? 'Has solicitado una cotización. Confirma el método de contacto.' 
              : 'Selecciona tu método de pago preferido para completar la compra.'}
          </p>
        </div>
      </Reveal>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment Method Selection */}
        <Reveal variants={slideUp} delay={0.1}>
          <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Elige cómo pagar</h3>
                <p className="text-sm text-secondary-500">Todos los métodos son seguros</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paymentMethods.map((method) => {
                const isSelected = formData.paymentMethod === method.id;
                const Icon = method.icon;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handlePaymentMethodChange(method.id as 'card' | 'transfer' | 'quote')}
                    className={`
                      p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                        : 'border-secondary-200 hover:border-primary-300 hover:bg-white'
                      }
                    `}
                  >
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                      ${isSelected
                        ? 'bg-primary-600 text-white scale-110'
                        : 'bg-secondary-100 text-secondary-400 group-hover:bg-primary-100 group-hover:text-primary-600'
                      }
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className={`font-semibold block ${isSelected ? 'text-primary-700' : 'text-secondary-700'
                        }`}>
                        {method.label}
                      </span>
                      <span className="text-xs text-secondary-400">
                        {method.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Card Payment Form */}
        {formData.paymentMethod === 'card' && (
          <Reveal variants={slideUp} delay={0.2} key="card-payment-form">
            <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Datos de la Tarjeta</h3>
                  <p className="text-sm text-secondary-500">Información de pago segura</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Nombre del Titular *
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    className={inputClasses(!!errors.cardholderName)}
                    placeholder="Como aparece en la tarjeta"
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                {/* Stripe Elements Placeholder */}
                <div className="p-5 bg-white rounded-xl border-2 border-dashed border-secondary-200">
                  <div className="flex items-center gap-2 text-secondary-600 mb-3">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Pago seguro con Stripe</span>
                  </div>

                  {/* Mock card input fields for visualization */}
                  <div className="space-y-3">
                    <div className="bg-secondary-50 p-3.5 rounded-xl border border-secondary-200">
                      <span className="text-secondary-400 text-sm">4242 4242 4242 4242</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-secondary-50 p-3.5 rounded-xl border border-secondary-200">
                        <span className="text-secondary-400 text-sm">MM/AA</span>
                      </div>
                      <div className="bg-secondary-50 p-3.5 rounded-xl border border-secondary-200">
                        <span className="text-secondary-400 text-sm">CVC</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-secondary-400 mt-3">
                    Los campos de tarjeta se procesan de forma segura con Stripe.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Transfer Payment Info */}
        {formData.paymentMethod === 'transfer' && (
          <Reveal variants={slideUp} delay={0.2} key="transfer-payment-info">
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Datos para Transferencia</h3>
                  <p className="text-sm text-secondary-500">Realiza tu pago por SPEI</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 space-y-4 border border-emerald-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-secondary-400 uppercase tracking-wide">Banco</p>
                    <p className="font-semibold text-secondary-900">BBVA México</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400 uppercase tracking-wide">Titular</p>
                    <p className="font-semibold text-secondary-900">Archiquect S.A. de C.V.</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">CLABE Interbancaria</p>
                  <p className="font-mono font-bold text-lg text-emerald-600">0123 4567 8901 2345 67</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wide">Referencia</p>
                  <p className="font-medium text-secondary-600">Se generará al confirmar</p>
                </div>
              </div>

              <p className="text-sm text-secondary-500 mt-4 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                Una vez realizada la transferencia, envía el comprobante a pagos@archiquect.com
              </p>
            </div>
          </Reveal>
        )}

        {/* Quote Request Info */}
        {formData.paymentMethod === 'quote' && (
          <Reveal variants={slideUp} delay={0.2} key="quote-payment-info">
            <div className="bg-violet-50/50 rounded-2xl p-6 border border-violet-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Solicitud de Cotización</h3>
                  <p className="text-sm text-secondary-500">Sin compromiso de compra</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-violet-100">
                <p className="text-secondary-700 leading-relaxed">
                  Al confirmar, recibirás una cotización personalizada en tu correo electrónico
                  dentro de las próximas <strong>24-48 horas hábiles</strong>. Un asesor se pondrá en contacto
                  contigo para discutir los detalles del proyecto.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Billing Address */}
        {formData.paymentMethod === 'card' && (
          <Reveal variants={slideUp} delay={0.3} key="billing-address">
            <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
              <h3 className="font-semibold text-secondary-900 mb-4">Dirección de Facturación</h3>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-xl border border-secondary-200 hover:border-primary-300 transition-colors">
                <input
                  type="checkbox"
                  name="billing.sameAsShipping"
                  checked={formData.billingAddress?.sameAsShipping}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-md border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-700">
                  Usar la misma dirección que ingresé anteriormente
                </span>
              </label>

              {!formData.billingAddress?.sameAsShipping && (
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="billing.address" className="block text-sm font-medium text-secondary-700 mb-1.5">Dirección</label>
                    <input
                      type="text"
                      id="billing.address"
                      name="billing.address"
                      value={formData.billingAddress?.address || ''}
                      onChange={handleChange}
                      className={inputClasses(false)}
                      placeholder="Calle y número"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billing.city" className="block text-sm font-medium text-secondary-700 mb-1.5">Ciudad</label>
                      <input
                        type="text"
                        id="billing.city"
                        name="billing.city"
                        value={formData.billingAddress?.city || ''}
                        onChange={handleChange}
                        className={inputClasses(false)}
                      />
                    </div>
                    <div>
                      <label htmlFor="billing.postalCode" className="block text-sm font-medium text-secondary-700 mb-1.5">Código Postal</label>
                      <input
                        type="text"
                        id="billing.postalCode"
                        name="billing.postalCode"
                        value={formData.billingAddress?.postalCode || ''}
                        onChange={handleChange}
                        className={inputClasses(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Security notice */}
        <Reveal variants={fadeIn} delay={0.4} key="security-notice">
          <div className="flex items-center gap-2 text-secondary-500 text-sm justify-center">
            <Lock className="w-4 h-4" />
            <span>Tus datos están protegidos con encriptación SSL de 256 bits</span>
          </div>
        </Reveal>

        {/* Navigation buttons */}
        <Reveal variants={fadeIn} delay={0.5} key="nav-buttons">
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
              Revisar Pedido
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>
      </form>
    </div>
  );
};

export default PaymentInfoForm;
