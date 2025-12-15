import { Home, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-800 text-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Archiquect
              </span>
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed">
              Planos y proyectos arquitectónicos de alta calidad. 
              Diseños únicos para hacer realidad tu espacio soñado.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>contacto@archiquect.com</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>Ciudad de México, México</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Soporte
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-sm text-secondary-400">
          <p>&copy; {new Date().getFullYear()} Archiquect. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
