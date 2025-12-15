import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, Home, FileText, ArrowRight } from 'lucide-react';

const ConfirmationPage = () => {
  const { reservationId } = useParams<{ reservationId: string }>();

  return (
    <div className="py-12 lg:py-20 bg-secondary-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-secondary-800 mb-2">
            ¡Reserva Confirmada!
          </h1>
          
          <p className="text-secondary-600 mb-6">
            Tu solicitud ha sido procesada exitosamente.
          </p>

          {/* Reservation ID */}
          <div className="bg-secondary-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-secondary-500 mb-1">Número de reserva</p>
            <p className="font-mono text-lg font-bold text-primary-600">
              {reservationId}
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-left space-y-4 mb-8">
            <h2 className="font-medium text-secondary-800 text-center mb-4">
              Próximos pasos
            </h2>
            
            <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-800">Revisa tu correo</p>
                <p className="text-sm text-secondary-600">
                  Te hemos enviado un email de confirmación con los detalles de tu reserva.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-800">Procesamiento</p>
                <p className="text-sm text-secondary-600">
                  Nuestro equipo revisará tu solicitud y te contactará en 24-48 horas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-800">Entrega de archivos</p>
                <p className="text-sm text-secondary-600">
                  Una vez confirmado el pago, recibirás los planos en formato digital.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
            <Link to="/proyectos" className="btn-primary flex items-center justify-center gap-2">
              Ver más proyectos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-secondary-500 text-sm">
            ¿Tienes preguntas? Contáctanos en{' '}
            <a href="mailto:soporte@archiquect.com" className="text-primary-600 hover:underline">
              soporte@archiquect.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
