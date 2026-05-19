'use client';

import Link from 'next/link';
import { Users, ArrowRight, CheckCircle2, Play, MapPin, Phone, Mail } from 'lucide-react';
import { aboutStats, aboutValues, aboutTeam } from '../../data/about';
import { useAboutPage } from '../../hooks/front/useAboutPage';
import { useCMS } from '../../hooks/front/useCMS';
import { EditableText, EditableImage } from '../../components/ui/Editable';
import Reveal from '../../components/ui/Reveal';
import { slideUp, fadeIn, slideInFromLeft, slideInFromRight } from '../../animations/variants';

const AboutPage = () => {
  const { heroImage: defaultHeroImage, teamImages, officeImage: defaultOfficeImage } = useAboutPage();
  const { content = {} } = useCMS('about');

  const heroImage = content.hero_image || defaultHeroImage;
  const officeImage = content.story_image || defaultOfficeImage;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-secondary-900 text-white pt-36 pb-24 overflow-hidden">
        {heroImage && (
          <Reveal variants={fadeIn} className="absolute inset-0 w-full h-full">
            <EditableImage
              page="about"
              section="hero"
              keyName="hero_image"
              defaultUrl={heroImage}
              alt="Equipo Archiquect"
              className="w-full h-full object-cover opacity-30"
              containerClassName="absolute inset-0 w-full h-full"
              buttonClassName="bottom-4 right-4 z-20"
            />
          </Reveal>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal variants={slideUp}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-primary-400 font-medium text-sm uppercase tracking-wider mb-4">
                <Users className="w-5 h-5" />
                <EditableText
                  page="about"
                  section="hero"
                  keyName="badge"
                  defaultValue="Sobre nosotros"
                />
              </span>
              <EditableText
                page="about"
                section="hero"
                keyName="title"
                defaultValue="Diseñamos hogares que inspiran"
                as="h1"
                className="font-heading text-4xl lg:text-6xl font-bold mb-6"
              />
              <EditableText
                page="about"
                section="hero"
                keyName="desc"
                defaultValue="Somos un equipo de arquitectos e ingenieros apasionados por crear espacios que transforman la vida de las personas. Desde 2009, hemos ayudado a miles de familias a construir el hogar de sus sueños."
                as="p"
                className="text-secondary-300 text-xl leading-relaxed mb-8"
              />
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
              >
                <EditableText
                  page="about"
                  section="hero"
                  keyName="cta"
                  defaultValue="Ver nuestros proyectos"
                />
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
                <EditableText
                  page="about"
                  section="stats"
                  keyName={`stat_${index}_value`}
                  defaultValue={stat.value}
                  as="div"
                  className="text-4xl lg:text-5xl font-heading font-bold text-primary-600 mb-1"
                />
                <EditableText
                  page="about"
                  section="stats"
                  keyName={`stat_${index}_label`}
                  defaultValue={stat.label}
                  as="div"
                  className="font-bold text-secondary-800"
                />
                <EditableText
                  page="about"
                  section="stats"
                  keyName={`stat_${index}_desc`}
                  defaultValue={stat.description}
                  as="div"
                  className="text-sm text-secondary-500"
                />
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
                <EditableText
                  page="about"
                  section="story"
                  keyName="badge"
                  defaultValue="Nuestra Historia"
                  as="span"
                  className="text-primary-600 font-medium text-sm uppercase tracking-wider"
                />
                <EditableText
                  page="about"
                  section="story"
                  keyName="title"
                  defaultValue="De una idea a miles de hogares construidos"
                  as="h2"
                  className="font-heading text-3xl lg:text-4xl font-bold text-secondary-900 mt-2 mb-6"
                />
                <div className="space-y-4 text-secondary-600 leading-relaxed">
                  <EditableText
                    page="about"
                    section="story"
                    keyName="p1"
                    defaultValue="Archiquect nació en 2009 con una misión simple: democratizar el acceso a diseños arquitectónicos de alta calidad. Creíamos que cada familia merece un hogar bien diseñado, sin importar su presupuesto."
                    as="p"
                  />
                  <EditableText
                    page="about"
                    section="story"
                    keyName="p2"
                    defaultValue="Hoy, más de 10,000 familias en Latinoamérica han construido sus casas utilizando nuestros planos. Cada proyecto refleja nuestra pasión por la arquitectura funcional, estética y sostenible."
                    as="p"
                  />
                  <EditableText
                    page="about"
                    section="story"
                    keyName="p3"
                    defaultValue="Nuestro equipo trabaja constantemente en nuevos diseños que incorporan las últimas tendencias y tecnologías constructivas, asegurando que siempre tengas acceso a lo mejor del mercado."
                    as="p"
                  />
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <EditableText
                      page="about"
                      section="story"
                      keyName="check1"
                      defaultValue="Planos verificado por arquitectos colegiados"
                      as="span"
                      className="text-secondary-700 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <EditableText
                      page="about"
                      section="story"
                      keyName="check2"
                      defaultValue="Documentación técnica completa"
                      as="span"
                      className="text-secondary-700 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <EditableText
                      page="about"
                      section="story"
                      keyName="check3"
                      defaultValue="Soporte durante todo el proceso"
                      as="span"
                      className="text-secondary-700 font-medium"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal variants={slideInFromRight}>
              <div className="relative">
                {officeImage && (
                  <EditableImage
                    page="about"
                    section="story"
                    keyName="story_image"
                    defaultUrl={officeImage}
                    alt="Oficina Archiquect"
                    className="w-full rounded-2xl shadow-2xl"
                    containerClassName="w-full"
                    buttonClassName="bottom-4 right-4 z-20"
                  />
                )}
                {/* Video Play Button Overlay */}
                <button className="absolute inset-0 flex items-center justify-center group pointer-events-none">
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
              <EditableText
                page="about"
                section="values"
                keyName="title"
                defaultValue="Lo que nos define"
                as="h2"
                className="font-heading text-3xl lg:text-4xl font-bold text-secondary-900 mt-2"
              />
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
                  <EditableText
                    page="about"
                    section="values"
                    keyName={`value_${index}_title`}
                    defaultValue={value.title}
                    as="h3"
                    className="font-heading text-xl font-bold text-secondary-900 mb-2"
                  />
                  <EditableText
                    page="about"
                    section="values"
                    keyName={`value_${index}_desc`}
                    defaultValue={value.description}
                    as="p"
                    className="text-secondary-600 text-sm leading-relaxed"
                  />
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
              <EditableText
                page="about"
                section="team"
                keyName="title"
                defaultValue="Los expertos detrás de cada diseño"
                as="h2"
                className="font-heading text-3xl lg:text-4xl font-bold text-secondary-900 mt-2"
              />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutTeam.map((member, index) => (
              <Reveal key={index} variants={slideUp} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="relative w-48 h-48 mx-auto mb-5 rounded-2xl overflow-hidden bg-secondary-100">
                    <EditableImage
                      page="about"
                      section="team"
                      keyName={`member_${index}_image`}
                      defaultUrl={teamImages[member.name] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      containerClassName="w-full h-full"
                      buttonClassName="bottom-2 right-2 z-20"
                    />
                  </div>
                  <EditableText
                    page="about"
                    section="team"
                    keyName={`member_${index}_name`}
                    defaultValue={member.name}
                    as="h3"
                    className="font-heading font-bold text-secondary-900 mb-1"
                  />
                  <EditableText
                    page="about"
                    section="team"
                    keyName={`member_${index}_role`}
                    defaultValue={member.role}
                    as="p"
                    className="text-primary-600 text-sm font-medium"
                  />
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
                <EditableText
                  page="about"
                  section="contact"
                  keyName="title"
                  defaultValue="¿Tienes preguntas?"
                  as="h2"
                  className="font-heading text-3xl lg:text-4xl font-bold mb-6"
                />
                <EditableText
                  page="about"
                  section="contact"
                  keyName="desc"
                  defaultValue="Nuestro equipo está disponible para ayudarte a encontrar el proyecto perfecto o resolver cualquier duda sobre el proceso de compra."
                  as="p"
                  className="text-secondary-300 text-lg mb-8"
                />
                <Link
                  href="/checkout"
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
                    <EditableText
                      page="about"
                      section="contact"
                      keyName="address"
                      defaultValue="Av. Reforma 123, CDMX, México"
                      as="p"
                      className="font-medium text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm">Teléfono</p>
                    <EditableText
                      page="about"
                      section="contact"
                      keyName="phone"
                      defaultValue="+52 55 1234 5678"
                      as="p"
                      className="font-medium text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm">Email</p>
                    <EditableText
                      page="about"
                      section="contact"
                      keyName="email"
                      defaultValue="contacto@archiquect.com"
                      as="p"
                      className="font-medium text-white"
                    />
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
