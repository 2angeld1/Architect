import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, ArrowRight } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section id="nosotros" className="py-20 bg-secondary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
              Estamos aquí para ti
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mt-2 mb-6">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-secondary-300 text-lg leading-relaxed mb-8">
              Nuestro equipo de expertos está listo para ayudarte a encontrar el proyecto perfecto 
              o crear una cotización personalizada para tu próximo hogar.
            </p>

            {/* Schedule */}
            <div className="flex items-center gap-3 text-secondary-300 mb-8">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-white font-medium">Lun - Vie: 9:00 - 18:00</span>
                <span className="mx-2 text-secondary-500">|</span>
                <span>Sáb: 9:00 - 14:00</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25"
            >
              <span>Solicitar Cotización</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right - Contact Cards */}
          <div className="grid gap-4">
            {/* Phone Card */}
            <a
              href="tel:+525512345678"
              className="group flex items-center gap-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary-400/50 hover:bg-white/10 transition-all duration-300"
            >
              <div className="p-4 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                <Phone className="w-7 h-7 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Llámanos</h3>
                <p className="text-primary-400 font-medium">+52 55 1234 5678</p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:contacto@archiquect.com"
              className="group flex items-center gap-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary-400/50 hover:bg-white/10 transition-all duration-300"
            >
              <div className="p-4 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                <Mail className="w-7 h-7 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Escríbenos</h3>
                <p className="text-primary-400 font-medium">contacto@archiquect.com</p>
              </div>
            </a>

            {/* Chat Card */}
            <a
              href="https://wa.me/525512345678"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-300"
            >
              <div className="p-4 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                <MessageCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">WhatsApp</h3>
                <p className="text-emerald-400 font-medium">Chat en vivo</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
