import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, Shield, Award, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Planos Arquitectónicos de{' '}
              <span className="text-primary-300">Alta Calidad</span>
            </h1>
            <p className="text-lg lg:text-xl text-primary-100 mb-8 leading-relaxed">
              Diseños únicos y profesionales para hacer realidad tu proyecto. 
              Desde casas modernas hasta espacios comerciales, encuentra el plano 
              perfecto o solicita una cotización personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/proyectos" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
                Ver Proyectos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/checkout" className="btn-outline border-white text-white hover:bg-white/10">
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Más de 15 años de experiencia diseñando espacios que inspiran y funcionan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-secondary-800 mb-2">
                Diseños Precisos
              </h3>
              <p className="text-secondary-600 text-sm">
                Planos detallados con especificaciones técnicas listas para construcción.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-secondary-800 mb-2">
                Compra Segura
              </h3>
              <p className="text-secondary-600 text-sm">
                Pagos protegidos y entrega digital garantizada de tus archivos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-secondary-800 mb-2">
                Calidad Premium
              </h3>
              <p className="text-secondary-600 text-sm">
                Diseños que cumplen con normativas locales e internacionales.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-secondary-800 mb-2">
                Soporte Experto
              </h3>
              <p className="text-secondary-600 text-sm">
                Asesoría personalizada antes, durante y después de tu compra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-8 lg:p-12 text-center text-white">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Solicita una cotización personalizada y recibe un diseño único 
              adaptado a tus necesidades específicas.
            </p>
            <Link 
              to="/checkout" 
              className="btn bg-white text-primary-600 hover:bg-primary-50"
            >
              Solicitar Cotización
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
