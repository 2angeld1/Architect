'use client';

import { useState, useEffect } from 'react';
import { Hammer, CheckCircle2, HardHat, Ruler, BookOpen } from 'lucide-react';
import Reveal from '../../components/ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';
import { useCMS } from '../../hooks/front/useCMS';
import { EditableText, EditableImage } from '../../components/ui/Editable';

const BuildingGuidePage = () => {
  const [activeSection, setActiveSection] = useState('how-it-works');
  const { content = {}, isLoading } = useCMS('construccion');

  // Dynamic Steps structure mapped to CMS keys
  const steps = [
    {
      icon: BookOpen,
      title: content['steps_step1_title'] || "1. Elige tu Diseño",
      desc: content['steps_step1_desc'] || "Explora nuestra colección y selecciona el plano que mejor se adapte a tu terreno y estilo de vida."
    },
    {
      icon: Ruler,
      title: content['steps_step2_title'] || "2. Adaptación del Terreno",
      desc: content['steps_step2_desc'] || "Nuestros expertos revisan la topografía de tu terreno para asegurar que la construcción sea viable."
    },
    {
      icon: HardHat,
      title: content['steps_step3_title'] || "3. Permisos y Trámites",
      desc: content['steps_step3_desc'] || "Te asesoramos con toda la documentación necesaria para obtener las licencias de construcción."
    },
    {
      icon: Hammer,
      title: content['steps_step4_title'] || "4. Construcción",
      desc: content['steps_step4_desc'] || "Supervisión experta durante todo el proceso de obra para garantizar la calidad."
    },
    {
      icon: CheckCircle2,
      title: content['steps_step5_title'] || "5. Entrega de Llaves",
      desc: content['steps_step5_desc'] || "Recibe tu casa terminada, limpia y lista para habitar. Garantía por escrito."
    }
  ];

  // Dynamic Benefits mapped to CMS keys
  const benefits = [
    { 
      icon: CheckCircle2, 
      title: content['benefits_benefit1_title'] || 'Precio Cerrado', 
      desc: content['benefits_benefit1_desc'] || 'Sin sorpresas ni costos ocultos.' 
    },
    { 
      icon: Ruler, 
      title: content['benefits_benefit2_title'] || 'Diseño Personalizado', 
      desc: content['benefits_benefit2_desc'] || 'Adaptamos cualquier modelo a tus necesidades.' 
    },
    { 
      icon: HardHat, 
      title: content['benefits_benefit3_title'] || 'Supervisión Técnica', 
      desc: content['benefits_benefit3_desc'] || 'Ingenieros y arquitectos a cargo de tu obra.' 
    }
  ];

  // Dynamic FAQs mapped to CMS keys
  const faqs = [
    { 
      q: content['faq_faq1_q'] || "¿Cuánto tiempo tarda la construcción?", 
      a: content['faq_faq1_a'] || "El tiempo promedio es de 6 a 9 meses, dependiendo del tamaño y complejidad del proyecto." 
    },
    { 
      q: content['faq_faq2_q'] || "¿Puedo visitar la obra?", 
      a: content['faq_faq2_a'] || "¡Claro! Fomentamos las visitas programadas para que veas el avance de tu futuro hogar." 
    },
    { 
      q: content['faq_faq3_q'] || "¿Incluyen los trámites municipales?", 
      a: content['faq_faq3_a'] || "Sí, nuestro equipo legal y técnico se encarga de gestionar todos los permisos necesarios." 
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['how-it-works', 'benefits', 'steps', 'faq'];
      const scrollPosition = window.scrollY + 200; // Adjustment for header offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 180; // Adjusted for sticky header + subnav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-secondary-900 text-white pt-36 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 rounded-l-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 backdrop-blur-md rounded-full text-primary-300 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/30">
                <HardHat className="w-4 h-4" />
                Guía del Constructor
              </span>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-6">
                <EditableText
                  page="construccion"
                  section="hero"
                  keyName="title"
                  defaultValue={content['hero_title'] || 'Construyendo una Casa'}
                  as="span"
                />
              </h1>
              <p className="text-secondary-300 text-lg leading-relaxed max-w-2xl">
                <EditableText
                  page="construccion"
                  section="hero"
                  keyName="subtitle"
                  defaultValue={content['hero_subtitle'] || 'Entendemos que construir tu hogar es una de las decisiones más importantes de tu vida. Aquí te explicamos cómo hacemos que el proceso sea sencillo, transparente y emocionante.'}
                  as="span"
                />
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-[112px] z-40 bg-white border-b border-secondary-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4">
            {[
              { id: 'how-it-works', label: '¿Cómo funciona?' },
              { id: 'benefits', label: 'Beneficios' },
              { id: 'steps', label: 'Proceso paso a paso' },
              { id: 'faq', label: 'Preguntas Frecuentes' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap text-sm font-bold transition-colors relative
                  ${activeSection === item.id 
                    ? 'text-primary-600' 
                    : 'text-secondary-500 hover:text-secondary-800'
                  }
                `}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-4 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        
        {/* Section 1: How it Works */}
        <section id="how-it-works" className="scroll-mt-32">
           <Reveal variants={slideUp}>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-heading text-3xl font-bold text-secondary-900 mb-6">
                  <EditableText
                    page="construccion"
                    section="howItWorks"
                    keyName="title"
                    defaultValue={content['howItWorks_title'] || 'Del Papel a la Realidad'}
                    as="span"
                  />
                </h2>
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  <EditableText
                    page="construccion"
                    section="howItWorks"
                    keyName="desc1"
                    defaultValue={content['howItWorks_desc1'] || 'Muchos clientes llegan con incertidumbre sobre el proceso de construcción. ¿Cuánto costará realmente? ¿Cuánto tiempo tomará? En Archiquect eliminamos esas dudas con nuestro sistema de gestión integral.'}
                    as="span"
                  />
                </p>
                <p className="text-secondary-600 leading-relaxed">
                  <EditableText
                    page="construccion"
                    section="howItWorks"
                    keyName="desc2"
                    defaultValue={content['howItWorks_desc2'] || 'No solo vendemos planos; ofrecemos un acompañamiento completo para que tu experiencia de construcción sea libre de estrés.'}
                    as="span"
                  />
                </p>
              </div>
              <div className="relative">
                <div className="aspect-video bg-secondary-100 rounded-2xl overflow-hidden shadow-2xl">
                   <EditableImage
                     page="construccion"
                     section="howItWorks"
                     keyName="image"
                     defaultUrl={content['howItWorks_image'] || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"}
                     alt="Construction Site"
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary-600 p-6 rounded-2xl text-white shadow-xl max-w-xs z-20">
                  <p className="font-bold text-xl mb-1">
                    <EditableText
                      page="construccion"
                      section="howItWorks"
                      keyName="badgeYears"
                      defaultValue={content['howItWorks_badgeYears'] || '15+ Años'}
                      as="span"
                    />
                  </p>
                  <p className="text-primary-100 text-sm">
                    <EditableText
                      page="construccion"
                      section="howItWorks"
                      keyName="badgeDesc"
                      defaultValue={content['howItWorks_badgeDesc'] || 'De experiencia construyendo sueños en todo el país.'}
                      as="span"
                    />
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Section 2: Benefits */}
        <section id="benefits" className="scroll-mt-32 bg-secondary-50 p-8 lg:p-12 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-secondary-900 mb-4">
              <EditableText
                page="construccion"
                section="benefits"
                keyName="title"
                defaultValue={content['benefits_title'] || '¿Por qué elegirnos?'}
                as="span"
              />
            </h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              <EditableText
                page="construccion"
                section="benefits"
                keyName="subtitle"
                defaultValue={content['benefits_subtitle'] || 'Beneficios diseñados para tu tranquilidad y economía.'}
                as="span"
              />
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm text-center">
                 <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                   <benefit.icon className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-secondary-900 mb-2">
                   <EditableText
                     page="construccion"
                     section="benefits"
                     keyName={`benefit${idx + 1}_title`}
                     defaultValue={benefit.title}
                     as="span"
                   />
                 </h3>
                 <p className="text-sm text-secondary-500">
                   <EditableText
                     page="construccion"
                     section="benefits"
                     keyName={`benefit${idx + 1}_desc`}
                     defaultValue={benefit.desc}
                     as="span"
                   />
                 </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Steps */}
        <section id="steps" className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-secondary-900">
              <EditableText
                page="construccion"
                section="steps"
                keyName="title"
                defaultValue={content['steps_title'] || 'Pasos para construir tu hogar'}
                as="span"
              />
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <Reveal key={idx} variants={slideUp} delay={idx * 0.1}>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary-600 mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 border border-secondary-100">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-3">
                    <EditableText
                      page="construccion"
                      section="steps"
                      keyName={`step${idx + 1}_title`}
                      defaultValue={step.title}
                      as="span"
                    />
                  </h3>
                  <p className="text-sm text-secondary-500 leading-relaxed">
                    <EditableText
                      page="construccion"
                      section="steps"
                      keyName={`step${idx + 1}_desc`}
                      defaultValue={step.desc}
                      as="span"
                    />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section id="faq" className="scroll-mt-32 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-secondary-900 mb-8 text-center">
              <EditableText
                page="construccion"
                section="faq"
                keyName="title"
                defaultValue={content['faq_title'] || 'Preguntas Frecuentes'}
                as="span"
              />
            </h2>
            <div className="space-y-4">
               {faqs.map((faq, idx) => (
                 <div key={idx} className="bg-secondary-50 p-6 rounded-2xl text-left">
                   <h3 className="font-bold text-secondary-900 mb-2">
                     <EditableText
                       page="construccion"
                       section="faq"
                       keyName={`faq${idx + 1}_q`}
                       defaultValue={faq.q}
                       as="span"
                     />
                   </h3>
                   <p className="text-secondary-600">
                     <EditableText
                       page="construccion"
                       section="faq"
                       keyName={`faq${idx + 1}_a`}
                       defaultValue={faq.a}
                       as="span"
                     />
                   </p>
                 </div>
               ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BuildingGuidePage;
