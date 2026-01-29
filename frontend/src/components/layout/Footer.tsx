import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold text-white">
                Archiquect
              </span>
            </Link>
            <p className="text-secondary-400 leading-relaxed mb-6">
              Más de 15 años diseñando espacios que inspiran.
              Planos arquitectónicos de alta calidad listos para construir.
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
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="hover:text-primary-400 transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <a href="#categorias" className="hover:text-primary-400 transition-colors">
                  Categorías
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-primary-400 transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-primary-400 transition-colors">
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
                <Link to="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas Modernas
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas Minimalistas
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas de 2 Pisos
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="hover:text-primary-400 transition-colors">
                  Casas Pequeñas
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="hover:text-primary-400 transition-colors">
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
                <span>Av. Reforma 123, Col. Centro,<br />Ciudad de México, México</span>
              </li>
              <li>
                <a href="tel:+525512345678" className="flex items-center gap-3 hover:text-primary-400 transition-colors">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span>+52 55 1234 5678</span>
                </a>
              </li>
              <li>
                <a href="mailto:contacto@archiquect.com" className="flex items-center gap-3 hover:text-primary-400 transition-colors">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span>contacto@archiquect.com</span>
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
