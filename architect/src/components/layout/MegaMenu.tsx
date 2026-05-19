'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../hooks/front/useCategories';
import { useProjects } from '../../hooks/front/useProjects';

interface MegaMenuProps {
  transparent?: boolean;
}

const MegaMenu = ({ transparent }: MegaMenuProps) => {
  const { categories, isLoading: loadingCategories } = useCategories();
  const { filteredProjects, projectImages, isLoading: loadingProjects } = useProjects();
  const [activeTabId, setActiveTabId] = useState<number | string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Set first category as active when categories load
  useEffect(() => {
    if (categories.length > 0 && activeTabId === null) {
      setActiveTabId(categories[0].id);
    }
  }, [categories, activeTabId]);

  const activeCategory = categories.find(c => c.id === activeTabId) || categories[0];

  // Filter projects belonging to the active category (case-insensitive comparison)
  const categoryProjects = filteredProjects.filter(
    (p: any) => p.category?.toLowerCase() === activeCategory?.name?.toLowerCase()
  );

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={`
          flex items-center gap-1 text-sm font-medium py-2 rounded-lg transition-colors
          ${isOpen ? 'text-primary-600' : (transparent ? 'text-white hover:text-white/80' : 'text-secondary-700 hover:text-primary-600')}
        `}
      >
        Diseños de casas
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-[1100px] bg-white rounded-2xl shadow-2xl border border-secondary-100 overflow-hidden z-50 flex"
            style={{ marginLeft: '-150px' }} // Centering adjustments for cleaner floating look
          >
            {/* Left Sidebar - Dynamic Categories List */}
            <div className="w-72 bg-white border-r border-secondary-100 py-4 flex-shrink-0">
              {categories.map((item) => {
                const IconComponent = item.icon || Home;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActiveTabId(item.id)}
                    className={`
                      w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-colors relative
                      ${activeTabId === item.id 
                        ? 'text-primary-700 bg-primary-50/75' 
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-primary-600'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4.5 h-4.5 text-secondary-500 group-hover:text-primary-500" />
                      {item.name}
                    </div>
                    {activeTabId === item.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full" />
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTabId === item.id ? 'opacity-100 translate-x-0.5 text-primary-600' : 'opacity-0'}`} />
                  </button>
                );
              })}
              
              <div className="border-t border-secondary-100 mt-4 pt-4 px-6">
                <Link 
                  href="/categorias" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-secondary-500 hover:text-primary-600"
                >
                  Ver todas las categorías <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Middle Content - Dynamic Projects under Active Category */}
            <div className="flex-1 bg-secondary-50/20 p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-primary-600 text-xs uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  Diseños en {activeCategory?.name}
                </h3>

                {categoryProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {categoryProjects.slice(0, 3).map((project) => (
                      <Link 
                        href={`/proyectos/${project.id}`} 
                        key={project.id} 
                        className="flex items-center gap-4 group bg-white p-3 rounded-xl transition-all shadow-sm hover:shadow border border-secondary-100 hover:border-primary-200"
                      >
                        <img 
                          src={projectImages[project.id]} 
                          alt={project.name} 
                          className="w-20 h-14 object-cover rounded-lg shadow-sm" 
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-secondary-800 group-hover:text-primary-600 transition-colors truncate text-sm">
                            {project.name}
                          </span>
                          <span className="block text-xs text-secondary-500 truncate mt-0.5">
                            {project.rooms} hab. • {project.bathrooms} baños • {project.area} m²
                          </span>
                        </div>
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          ${project.price.toLocaleString()} USD
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-secondary-100 shadow-sm flex flex-col items-center justify-center">
                    <p className="text-secondary-400 text-sm font-medium mb-3">No hay diseños disponibles en esta categoría todavía.</p>
                    <Link 
                      href="/proyectos" 
                      className="inline-flex px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-xs rounded-lg transition-colors"
                    >
                      Explorar todos los planos
                    </Link>
                  </div>
                )}
              </div>

              {categoryProjects.length > 3 && (
                <Link 
                  href={`/proyectos?category=${activeCategory?.name}`}
                  className="block text-center text-xs font-bold text-primary-600 hover:text-primary-700 mt-4"
                >
                  Ver los {categoryProjects.length} diseños de esta categoría →
                </Link>
              )}
            </div>

            {/* Right Sidebar - Dynamic Subcategories and Promo */}
            <div className="w-80 bg-white border-l border-secondary-100 p-8 flex flex-col justify-between flex-shrink-0">
              <div>
                <h4 className="font-bold text-secondary-400 text-xs uppercase tracking-wider mb-6">
                  Estilos y Variantes
                </h4>
                
                {activeCategory?.subcategories && activeCategory.subcategories.length > 0 ? (
                  <div className="space-y-2">
                    {activeCategory.subcategories.slice(0, 5).map((sub, idx) => (
                      <Link 
                        href={`/proyectos?search=${sub}`} 
                        key={idx} 
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary-50 group transition-all border border-transparent hover:border-secondary-100"
                      >
                        <span className="text-xs font-bold text-secondary-700 group-hover:text-primary-600 transition-colors">
                          {sub}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-secondary-400 font-medium">Modelos listos para construir y adaptar a tu terreno.</p>
                )}
              </div>

              {/* High-quality CTA Banner */}
              <div className="mt-8 p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                <span className="block text-xs font-bold text-primary-700 uppercase tracking-wide mb-1">¿Necesitas cambios?</span>
                <p className="text-[11px] text-secondary-600 leading-relaxed mb-3">
                  Adaptamos la distribución, tamaño y fachadas de cualquier plano según tu terreno o gusto.
                </p>
                <Link 
                  href="/nosotros" 
                  className="inline-flex items-center gap-0.5 text-xs font-bold text-primary-600 hover:text-primary-700"
                >
                  Hablar con un arquitecto <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;
