'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Phone, Home } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from './MegaMenu';
import { useLayout } from '../../hooks/front/useLayout';
import { useCMS } from '../../hooks/front/useCMS';
import { EditableText } from '../ui/Editable';

interface HeaderProps {}

const Header = () => {
  const { isTransparentPage } = useLayout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const selectedProject = useCheckoutStore((state: any) => state.selectedProject);

  // Dynamic menu links with high-quality fallback defaults
  const [primaryLinks, setPrimaryLinks] = useState([
    { name: 'Inicio', path: '/' },
    { name: 'Proyectos', path: '/proyectos' },
    { name: 'Nosotros', path: '/nosotros' },
  ]);

  const [secondaryLinks, setSecondaryLinks] = useState([
    { name: 'Diseños de garajes', path: '/proyectos' },
    { name: 'Promociones', path: '/promociones', isHighlight: true },
    { name: 'Construyendo una casa', path: '/construyendo-una-casa' },
    { name: 'Casas y Apartamentos', path: '/casas-ya-hechas' },
    { name: 'Diseño de Interiores', path: '/diseno-de-interiores' },
  ]);

  // Read menu links in real-time from CMS global configuration
  const { content } = useCMS('global');

  useEffect(() => {
    if (content) {
      if (content.menu_primary) {
        try {
          setPrimaryLinks(JSON.parse(content.menu_primary));
        } catch (e) {
          console.error('Error parsing primary links:', e);
        }
      }
      if (content.menu_secondary) {
        try {
          setSecondaryLinks(JSON.parse(content.menu_secondary));
        } catch (e) {
          console.error('Error parsing secondary links:', e);
        }
      }
    }
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if header should be transparent based on page AND scroll state
  const isTransparent = isTransparentPage && !isScrolled;

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

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      {content.promo_banner_active === 'true' && !isScrolled && (
        <div className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 text-center py-2.5 px-4 text-xs font-semibold tracking-wide shadow-sm flex items-center justify-center gap-2 relative z-50 font-sans border-b border-amber-600/30">
          <span>{content.promo_banner_text}</span>
          {content.promo_banner_code && (
            <span className="font-mono bg-zinc-950 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ml-1">
              {content.promo_banner_code}
            </span>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primary Row */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={`w-10 h-10 ${isTransparent ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary-600'} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
              <Home className={`w-5 h-5 ${isTransparent ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`font-heading text-xl font-bold ${textColor} transition-colors duration-300`}>
              Archiquect
            </span>
          </Link>

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
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
          <div className="hidden lg:flex items-center space-x-5">
            {/* Phone */}
            <div className={`flex items-center space-x-2 ${textColor} font-medium`}>
              <Phone className="w-4 h-4" />
              <a
                href={`tel:${content?.contact_phone || '+52 55 1234 5678'}`}
                className={`${linkHoverColor} transition-colors duration-200 text-sm`}
              >
                <EditableText
                  page="global"
                  section="contact"
                  keyName="phone"
                  defaultValue={content?.contact_phone || '+52 55 1234 5678'}
                />
              </a>
            </div>

            {/* Cart */}
            <Link 
              href="/checkout" 
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
              href="/checkout"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg ${isTransparent
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

        {/* Secondary Row - Catalog Navigation */}
        <div className={`hidden lg:flex items-center justify-center gap-8 h-12 border-t ${isTransparent ? 'border-white/10' : 'border-secondary-100'}`}>
          <MegaMenu transparent={isTransparent} />

          {secondaryLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm transition-colors relative group whitespace-nowrap ${
                (link as any).isHighlight 
                  ? (isTransparent ? 'text-white hover:text-white/90' : 'text-rose-500 hover:text-rose-600 font-bold') 
                  : (isActive(link.path)
                    ? (isTransparent ? 'text-white font-bold' : 'text-primary-600 font-bold')
                    : `${textColor} ${linkHoverColor}`)
              }`}
            >
              {link.name}
            </Link>
          ))}
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
                {primaryLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
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
                    href="/checkout" 
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
