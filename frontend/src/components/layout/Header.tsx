import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Phone, Home } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  transparent?: boolean;
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const selectedProject = useCheckoutStore((state) => state.selectedProject);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if header should be transparent based on prop AND scroll state
  const isTransparent = transparent && !isScrolled;

  // Dynamic classes
  const headerBg = isTransparent
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-lg';

  const textColor = isTransparent
    ? 'text-white'
    : 'text-secondary-800';

  const linkHoverColor = isTransparent
    ? 'hover:text-white'
    : 'hover:text-primary-600';

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Proyectos', path: '/proyectos' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Nosotros', path: '/nosotros' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-11 h-11 ${isTransparent ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary-600'} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
              <Home className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`font-heading text-2xl font-bold ${textColor} transition-colors duration-300`}>
              Archiquect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors relative group ${isActive(link.path)
                    ? (isTransparent ? 'text-white font-bold' : 'text-primary-600 font-bold')
                    : `${textColor} ${linkHoverColor}`
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Phone */}
            <a
              href="tel:+525512345678"
              className={`flex items-center space-x-2 ${textColor} ${linkHoverColor} font-medium transition-colors duration-200`}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">+52 55 1234 5678</span>
            </a>

            {/* Cart */}
            <Link 
              to="/checkout" 
              className={`relative p-2 rounded-lg ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-secondary-100'} transition-colors duration-200 group`}
            >
              <ShoppingCart className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-secondary-600 group-hover:text-primary-600'}`} />
              {selectedProject && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                  1
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Link
              to="/checkout"
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg ${isTransparent
                ? 'bg-white text-primary-700 hover:bg-white/90'
                : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
            >
              Cotizar Proyecto
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-secondary-100 text-secondary-800'} transition-colors`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-white/10 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl"
            >
              <div className="flex flex-col space-y-2 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${isActive(link.path)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-secondary-100 mt-2">
                  <Link
                    to="/checkout" 
                    className="block w-full text-center bg-primary-600 text-white py-3 rounded-xl font-medium shadow-md active:scale-95 transition-transform"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cotizar Proyecto
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
