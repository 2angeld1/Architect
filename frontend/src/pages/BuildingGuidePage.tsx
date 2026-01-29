import { useState, useEffect } from 'react';
import { Hammer, CheckCircle2, HardHat, Ruler, BookOpen } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import { fadeIn, slideUp } from '../animations/variants';

const steps = [
  {
    icon: BookOpen,
    title: "1. Elige tu Diseño",
    desc: "Explora nuestra colección y selecciona el plano que mejor se adapte a tu terreno y estilo de vida."
  },
  {
    icon: Ruler,
    title: "2. Adaptación del Terreno",
    desc: "Nuestros expertos revisan la topografía de tu terreno para asegurar que la construcción sea viable."
  },
  {
    icon: HardHat,
    title: "3. Permisos y Trámites",
    desc: "Te asesoramos con toda la documentación necesaria para obtener las licencias de construcción."
  },
  {
    icon: Hammer,
    title: "4. Construcción",
    desc: "Supervisión experta durante todo el proceso de obra para garantizar la calidad."
  },
  {
    icon: CheckCircle2,
    title: "5. Entrega de Llaves",
    desc: "Recibe tu casa terminada, limpia y lista para habitar. Garantía por escrito."
  }
];

const BuildingGuidePage = () => {
  const [activeSection, setActiveSection] = useState('how-it-works');

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
                Construyendo una Casa
              </h1>
              <p className="text-secondary-300 text-lg leading-relaxed max-w-2xl">
                Entendemos que construir tu hogar es una de las decisiones más importantes de tu vida. 
                Aquí te explicamos cómo hacemos que el proceso sea sencillo, transparente y emocionante.
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
                  Del Papel a la Realidad
                </h2>
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  Muchos clientes llegan con incertidumbre sobre el proceso de construcción. 
                  ¿Cuánto costará realmente? ¿Cuánto tiempo tomará? 
                  En Archiquect eliminamos esas dudas con nuestro sistema de gestión integral.
                </p>
                <p className="text-secondary-600 leading-relaxed">
                  No solo vendemos planos; ofrecemos un acompañamiento completo para que tu experiencia 
                  de construcción sea libre de estrés.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-video bg-secondary-100 rounded-2xl overflow-hidden shadow-2xl">
                   <img 
                     src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop" 
                     alt="Construction Site" 
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary-600 p-6 rounded-2xl text-white shadow-xl max-w-xs">
                  <p className="font-bold text-xl mb-1">15+ Años</p>
                  <p className="text-primary-100 text-sm">De experiencia construyendo sueños en todo el país.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Section 2: Benefits */}
        <section id="benefits" className="scroll-mt-32 bg-secondary-50 p-8 lg:p-12 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-secondary-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">Beneficios diseñados para tu tranquilidad y economía.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: 'Precio Cerrado', desc: 'Sin sorpresas ni costos ocultos.' },
              { icon: Ruler, title: 'Diseño Personalizado', desc: 'Adaptamos cualquier modelo a tus necesidades.' },
              { icon: HardHat, title: 'Supervisión Técnica', desc: 'Ingenieros y arquitectos a cargo de tu obra.' }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm text-center">
                 <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                   <benefit.icon className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-secondary-900 mb-2">{benefit.title}</h3>
                 <p className="text-sm text-secondary-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Steps */}
        <section id="steps" className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-secondary-900">Pasos para construir tu hogar</h2>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <Reveal key={idx} variants={slideUp} delay={idx * 0.1}>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary-600 mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 border border-secondary-100">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-secondary-500 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section id="faq" className="scroll-mt-32 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-secondary-900 mb-8 text-center">Preguntas Frecuentes</h2>
            <div className="space-y-4">
               {[
                 { q: "¿Cuánto tiempo tarda la construcción?", a: "El tiempo promedio es de 6 a 9 meses, dependiendo del tamaño y complejidad del proyecto." },
                 { q: "¿Puedo visitar la obra?", a: "¡Claro! Fomentamos las visitas programadas para que veas el avance de tu futuro hogar." },
                 { q: "¿Incluyen los trámites municipales?", a: "Sí, nuestro equipo legal y técnico se encarga de gestionar todos los permisos necesarios." }
               ].map((faq, idx) => (
                 <div key={idx} className="bg-secondary-50 p-6 rounded-2xl">
                   <h3 className="font-bold text-secondary-900 mb-2">{faq.q}</h3>
                   <p className="text-secondary-600">{faq.a}</p>
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
