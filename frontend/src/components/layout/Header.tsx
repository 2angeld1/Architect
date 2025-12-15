import { Link } from 'react-router-dom';
import { Home, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCheckoutStore } from '../../store/checkoutStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedProject = useCheckoutStore((state) => state.selectedProject);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-secondary-800">
              Archiquect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/proyectos" 
              className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
            >
              Proyectos
            </Link>
            <Link 
              to="/checkout" 
              className="relative text-secondary-600 hover:text-primary-600 font-medium transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {selectedProject && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-secondary-600" />
            ) : (
              <Menu className="w-6 h-6 text-secondary-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-secondary-100">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-secondary-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/proyectos" 
                className="text-secondary-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Proyectos
              </Link>
              <Link 
                to="/checkout" 
                className="text-secondary-600 hover:text-primary-600 font-medium flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Reserva</span>
                {selectedProject && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
