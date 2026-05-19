'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useCMS } from '../../hooks/front/useCMS';
import { EditableText } from '../ui/Editable';

const Footer = () => {
  const pathname = usePathname();
  const { content = {} } = useCMS('global');

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold text-white">
                Archiquect
              </span>
            </Link>
            <p className="text-secondary-400 leading-relaxed mb-6">
              <EditableText
                page="global"
                section="footer"
                keyName="description"
                defaultValue={content['footer_description'] || 'Más de 15 años diseñando espacios que inspiran. Planos arquitectónicos de alta calidad listos para construir.'}
                as="span"
              />
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="p-2.5 bg-secondary-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-secondary-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-secondary-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-secondary-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">
              Navegación
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="hover:text-primary-400 transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="hover:text-primary-400 transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-primary-400 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-primary-400 transition-colors">
                  Cotizar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">
              Categorías
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas Modernas
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas Minimalistas
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas de 2 Pisos
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas Pequeñas
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="hover:text-primary-400 transition-colors">
                  Departamentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-left">
                  <EditableText
                    page="global"
                    section="contact"
                    keyName="address"
                    defaultValue={content['contact_address'] || 'Av. Reforma 123, Col. Centro, Ciudad de México, México'}
                    as="span"
                  />
                </span>
              </li>
              <li>
                <a href={`tel:${content['contact_phone'] || '+52 55 1234 5678'}`} className="flex items-center gap-3 hover:text-primary-400 transition-colors">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span>
                    <EditableText
                      page="global"
                      section="contact"
                      keyName="phone"
                      defaultValue={content['contact_phone'] || '+52 55 1234 5678'}
                      as="span"
                    />
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${content['contact_email'] || 'contacto@archiquect.com'}`} className="flex items-center gap-3 hover:text-primary-400 transition-colors">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span>
                    <EditableText
                      page="global"
                      section="contact"
                      keyName="email"
                      defaultValue={content['contact_email'] || 'contacto@archiquect.com'}
                      as="span"
                    />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Archiquect. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-secondary-500 hover:text-primary-400 transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-secondary-500 hover:text-primary-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-secondary-500 hover:text-primary-400 transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
