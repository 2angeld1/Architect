'use client';

import { useCMS } from '../../hooks/front/useCMS';
import { EditableText } from '../ui/Editable';
import { Check, X } from 'lucide-react';

const ComparisonSection = () => {
  const { content = {} } = useCMS('home');

  const traditionalFeatures = [
    content['comparison_traditional_feature1'] || 'Tiempo de diseño: 3 a 6 meses',
    content['comparison_traditional_feature2'] || 'Costos elevados (4-10% del valor de obra)',
    content['comparison_traditional_feature3'] || 'Resultado final incierto hasta terminar',
    content['comparison_traditional_feature4'] || 'Costos extra por cada corrección',
  ];

  const archiquectFeatures = [
    content['comparison_archiquect_feature1'] || 'Tiempo de entrega: Inmediato',
    content['comparison_archiquect_feature2'] || 'Ahorro de hasta 80% en diseño',
    content['comparison_archiquect_feature3'] || 'Ves exactamente lo que compras (3D/Planos)',
    content['comparison_archiquect_feature4'] || 'Documentación técnica completa incluida',
  ];

  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wider font-sans">
            <EditableText
              page="home"
              section="comparison"
              keyName="badge"
              defaultValue={content['comparison_badge'] || 'Toma la mejor decisión'}
              as="span"
            />
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mt-2">
            <EditableText
              page="home"
              section="comparison"
              keyName="title"
              defaultValue={content['comparison_title'] || '¿Por qué elegir un proyecto listo?'}
              as="span"
            />
          </h2>
          <p className="text-secondary-600 mt-4 max-w-2xl mx-auto font-sans">
            <EditableText
              page="home"
              section="comparison"
              keyName="description"
              defaultValue={content['comparison_description'] || 'Compara las ventajas de nuestros proyectos listos para construir frente al proceso tradicional.'}
              as="span"
            />
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Traditional Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-secondary-100 opacity-80 hover:opacity-100 transition-opacity">
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-secondary-600 mb-2">
                <EditableText
                  page="home"
                  section="comparison"
                  keyName="traditional_title"
                  defaultValue={content['comparison_traditional_title'] || 'Arquitectura Tradicional'}
                  as="span"
                />
              </h3>
              <p className="text-secondary-500 text-sm font-sans">
                <EditableText
                  page="home"
                  section="comparison"
                  keyName="traditional_subtitle"
                  defaultValue={content['comparison_traditional_subtitle'] || 'El proceso de contratar un arquitecto desde cero.'}
                  as="span"
                />
              </p>
            </div>

            <ul className="space-y-4 font-sans text-left">
              {traditionalFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-secondary-600">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <EditableText
                      page="home"
                      section="comparison"
                      keyName={`traditional_feature${idx + 1}`}
                      defaultValue={feature}
                      as="span"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Archiquect Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-primary-100 shadow-xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-primary-100 px-4 py-1 rounded-bl-xl text-primary-700 text-sm font-bold font-heading pointer-events-none">
              Recomendado
            </div>
            
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-secondary-800 mb-2">
                <EditableText
                  page="home"
                  section="comparison"
                  keyName="archiquect_title"
                  defaultValue={content['comparison_archiquect_title'] || 'Experiencia Archiquect'}
                  as="span"
                />
              </h3>
              <p className="text-secondary-600 text-sm font-sans">
                <EditableText
                  page="home"
                  section="comparison"
                  keyName="archiquect_subtitle"
                  defaultValue={content['comparison_archiquect_subtitle'] || 'Proyectos premium listos para construir.'}
                  as="span"
                />
              </p>
            </div>

            <ul className="space-y-4 font-sans text-left">
              {archiquectFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-secondary-800 font-medium">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <EditableText
                      page="home"
                      section="comparison"
                      keyName={`archiquect_feature${idx + 1}`}
                      defaultValue={feature}
                      as="span"
                    />
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-secondary-100">
              <p className="text-primary-600 text-sm font-medium mb-4 text-center">
                <EditableText
                  page="home"
                  section="comparison"
                  keyName="cta_badge"
                  defaultValue={content['comparison_cta_badge'] || '¡Empieza tu obra meses antes!'}
                  as="span"
                />
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
