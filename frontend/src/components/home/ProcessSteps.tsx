import { Search, Download, Hammer, FileCheck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Encuentra tu Diseño',
    description: 'Explora nuestra colección de planos premium y usa los filtros para hallar el diseño que se adapta a tu terreno y estilo de vida.',
  },
  {
    icon: Download,
    title: '2. Descarga Inmediata',
    description: 'Recibe los archivos digitales completos (PDF y CAD) al instante después de tu compra segura. Sin esperas.',
  },
  {
    icon: FileCheck,
    title: '3. Adapta y Tramita',
    description: 'Nuestros planos incluyen toda la información técnica necesaria para que tu ingeniero local realice los trámites municipales.',
  },
  {
    icon: Hammer,
    title: '4. Construye tu Sueño',
    description: 'Entrega los planos a tu contratista y comienza la construcción con la seguridad de un diseño arquitectónico profesional.',
  },
];

const ProcessSteps = () => {
  return (
    <section className="py-20 bg-secondary-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider font-sans">
            ¿Cómo funciona?
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mt-2">
            Tu camino hacia el hogar ideal
          </h2>
          <p className="text-secondary-300 mt-4 max-w-2xl mx-auto font-sans">
            Simplificamos el complejo proceso de arquitectura para que puedas enfocarte en lo importante: construir tu futuro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-secondary-700 -z-10 group-hover:bg-primary-500/50 transition-colors duration-500" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 bg-secondary-800 border border-secondary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:border-primary-500 group-hover:bg-secondary-800 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20">
                  <step.icon className="w-7 h-7 text-primary-400 group-hover:text-primary-300" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-secondary-400 text-sm leading-relaxed font-sans group-hover:text-secondary-300 transition-colors">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
