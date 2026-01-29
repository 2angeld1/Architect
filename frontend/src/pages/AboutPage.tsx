import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, CheckCircle2, Play, MapPin, Phone, Mail } from 'lucide-react';
import { searchPhotos } from '../services/unsplash';
import { aboutStats, aboutValues, aboutTeam } from '../mocks/about';
import Reveal from '../components/ui/Reveal';
import { slideUp, fadeIn, slideInFromLeft, slideInFromRight } from '../animations/variants';

const AboutPage = () => {
  const [heroImage, setHeroImage] = useState('');
  const [teamImages, setTeamImages] = useState<Record<string, string>>({});
  const [officeImage, setOfficeImage] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      // Hero image
      const heroPhotos = await searchPhotos('architecture office team modern', 1);
      if (heroPhotos.length > 0) {
        setHeroImage(`${heroPhotos[0].urls.raw}&w=1920&q=85&fit=crop`);
      }

      // Office image
      const officePhotos = await searchPhotos('modern architecture office interior', 1);
      if (officePhotos.length > 0) {
        setOfficeImage(`${officePhotos[0].urls.raw}&w=800&q=85&fit=crop`);
      }

      // Team images
      for (const member of aboutTeam) {
        const photos = await searchPhotos(member.query, 1);
        if (photos.length > 0) {
          setTeamImages(prev => ({
            ...prev,
            [member.name]: `${photos[0].urls.raw}&w=400&q=85&fit=crop&crop=faces`,
          }));
        }
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-secondary-900 text-white pt-28 pb-24 overflow-hidden">
        {heroImage && (
          <Reveal variants={fadeIn} className="absolute inset-0 w-full h-full">
            <>
              <img 
                src={heroImage} 
                alt="Equipo Archiquect" 
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900 via-secondary-900/80 to-secondary-900/40" />
            </>
          </Reveal>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal variants={slideUp}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-primary-400 font-medium text-sm uppercase tracking-wider mb-4">
                <Users className="w-5 h-5" />
                Sobre nosotros
              </span>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-6">
                Diseñamos hogares que inspiran
              </h1>
              <p className="text-secondary-300 text-xl leading-relaxed mb-8">
                Somos un equipo de arquitectos e ingenieros apasionados por crear espacios 
                que transforman la vida de las personas. Desde 2009, hemos ayudado a miles 
                de familias a construir el hogar de sus sueños.
              </p>
              <Link
                to="/proyectos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
              >
                Ver nuestros proyectos
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <Reveal variants={slideUp} delay={0.2}>
          <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-heading font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="font-bold text-secondary-800">{stat.label}</div>
                <div className="text-sm text-secondary-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal variants={slideInFromLeft}>
              <div>
                <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">
                  Nuestra Historia
                </span>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-900 mt-2 mb-6">
                  De una idea a miles de hogares construidos
                </h2>
                <div className="space-y-4 text-secondary-600 leading-relaxed">
                  <p>
                    Archiquect nació en 2009 con una misión simple: democratizar el acceso a 
                    diseños arquitectónicos de alta calidad. Creíamos que cada familia merece 
                    un hogar bien diseñado, sin importar su presupuesto.
                  </p>
                  <p>
                    Hoy, más de 10,000 familias en Latinoamérica han construido sus casas 
                    utilizando nuestros planos. Cada proyecto refleja nuestra pasión por la 
                    arquitectura funcional, estética y sostenible.
                  </p>
                  <p>
                    Nuestro equipo trabaja constantemente en nuevos diseños que incorporan 
                    las últimas tendencias y tecnologías constructivas, asegurando que siempre 
                    tengas acceso a lo mejor del mercado.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {['Planos verificados por arquitectos colegiados', 'Documentación técnica completa', 'Soporte durante todo el proceso'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-secondary-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal variants={slideInFromRight}>
              <div className="relative">
                {officeImage && (
                  <img
                    src={officeImage}
                    alt="Oficina Archiquect"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                )}
                {/* Video Play Button Overlay */}
                <button className="absolute inset-0 flex items-center justify-center group">
                  <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-600 ml-1" />
                  </div>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="text-center mb-14">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">
                Nuestros Valores
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-900 mt-2">
                Lo que nos define
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutValues.map((value, index) => (
              <Reveal key={index} variants={slideUp} delay={index * 0.1} className="h-full">
                <div 
                  className="bg-white p-6 rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 group h-full"
                >
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary-100 group-hover:scale-110 transition-all">
                    <value.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-secondary-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="text-center mb-14">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">
                Nuestro Equipo
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-900 mt-2">
                Los expertos detrás de cada diseño
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutTeam.map((member, index) => (
              <Reveal key={index} variants={slideUp} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="relative w-48 h-48 mx-auto mb-5 rounded-2xl overflow-hidden bg-secondary-100">
                    {teamImages[member.name] ? (
                      <img
                        src={teamImages[member.name]}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-16 h-16 text-secondary-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-secondary-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 text-sm font-medium">
                    {member.role}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal variants={slideInFromLeft}>
              <div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                  ¿Tienes preguntas?
                </h2>
                <p className="text-secondary-300 text-lg mb-8">
                  Nuestro equipo está disponible para ayudarte a encontrar el proyecto 
                  perfecto o resolver cualquier duda sobre el proceso de compra.
                </p>
                <Link
                  to="/checkout"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
                >
                  Contactar ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>

            <Reveal variants={slideInFromRight}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm">Dirección</p>
                    <p className="font-medium">Av. Reforma 123, CDMX, México</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm">Teléfono</p>
                    <p className="font-medium">+52 55 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm">Email</p>
                    <p className="font-medium">contacto@archiquect.com</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
