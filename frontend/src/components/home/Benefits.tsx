import { Shield, Clock, Award, HeartHandshake, Truck, RefreshCw } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Pagos protegidos y garantía de satisfacción en cada proyecto',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Clock,
    title: 'Entrega Inmediata',
    description: 'Descarga tus planos al instante después de la compra',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Award,
    title: 'Calidad Premium',
    description: 'Diseños que cumplen normativas locales e internacionales',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: HeartHandshake,
    title: 'Soporte Experto',
    description: 'Asesoría profesional durante todo el proceso',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'Documentación física sin costo adicional',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: RefreshCw,
    title: 'Garantía de Cambio',
    description: '30 días para cambiar tu proyecto si no te convence',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">
            ¿Por qué elegirnos?
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mt-2">
            Beneficios de Comprar con Nosotros
          </h2>
          <p className="text-secondary-600 mt-3 max-w-2xl mx-auto">
            Más de 15 años de experiencia respaldan cada uno de nuestros proyectos
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-secondary-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-16 bg-primary-600 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">
                Confía en los expertos
              </h3>
              <p className="text-primary-100 max-w-lg">
                Únete a más de 10,000 familias que ya construyeron su hogar con nuestros proyectos
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white">500+</div>
                <div className="text-primary-200 text-sm">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white">10K+</div>
                <div className="text-primary-200 text-sm">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white">15+</div>
                <div className="text-primary-200 text-sm">Años</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white">98%</div>
                <div className="text-primary-200 text-sm">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
