import { Check, X } from 'lucide-react';
import { comparisonFeatures } from '../../data/home';

const ComparisonSection = () => {
  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wider font-sans">
            Toma la mejor decisión
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mt-2">
            ¿Por qué elegir un proyecto listo?
          </h2>
          <p className="text-secondary-600 mt-4 max-w-2xl mx-auto font-sans">
            Compara las ventajas de nuestros proyectos listos para construir frente al proceso tradicional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Traditional Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-secondary-100 opacity-80 hover:opacity-100 transition-opacity">
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-secondary-600 mb-2">
                Arquitectura Tradicional
              </h3>
              <p className="text-secondary-500 text-sm font-sans">
                El proceso de contratar un arquitecto desde cero.
              </p>
            </div>

            <ul className="space-y-4 font-sans">
                          {comparisonFeatures.traditional.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-secondary-600">
                                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                  </li>
              ))}
            </ul>
          </div>

          {/* Archiquect Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-primary-100 shadow-xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-primary-100 px-4 py-1 rounded-bl-xl text-primary-700 text-sm font-bold font-heading">
              Recomendado
            </div>
            
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-secondary-800 mb-2">
                Experiencia Archiquect
              </h3>
              <p className="text-secondary-600 text-sm font-sans">
                Proyectos premium listos para construir.
              </p>
            </div>

            <ul className="space-y-4 font-sans">
                          {comparisonFeatures.archiquect.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-secondary-800 font-medium">
                                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                  </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-secondary-100">
              <p className="text-primary-600 text-sm font-medium mb-4 text-center">
                ¡Empieza tu obra meses antes!
              </p>
              <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20">
                Ver Proyectos Disponibles
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
