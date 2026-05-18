'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Bell, Award, Percent, Hammer, Calculator } from 'lucide-react';
import { megaMenuData } from '../../data/menu';
import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuProps {
  transparent?: boolean;
}

const MegaMenu = ({ transparent }: MegaMenuProps) => {
  const [activeTab, setActiveTab] = useState('suelos');
  const [isOpen, setIsOpen] = useState(false);

  // We only implement content for 'suelos' as per screenshot, others fallback
  const currentContent = megaMenuData.content[activeTab as keyof typeof megaMenuData.content] || megaMenuData.content.default;

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
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-[1200px] bg-white rounded-2xl shadow-2xl border border-secondary-100 overflow-hidden z-50 flex"
            style={{ marginLeft: '-200px' }} // Adjusted offset for larger menu
          >
            {/* Left Sidebar */}
            <div className="w-72 bg-white border-r border-secondary-100 py-4">
              {megaMenuData.categories.map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-colors relative
                    ${activeTab === item.id 
                      ? 'text-red-700 bg-red-100' 
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-red-600'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-full" />
                  )}
                  <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
              
              <Link href="/categorias" className="block px-6 py-3 mt-2 text-sm text-secondary-500 hover:text-primary-600">
                Ver todas las categorías
              </Link>
            </div>

            {/* Middle Content */}
            <div className="flex-1 bg-secondary-50/30 p-8">
               <h3 className="font-bold text-red-500 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                 {megaMenuData.categories.find(c => c.id === activeTab)?.icon && (
                   // Render generic icon if needed, or just text
                   <span className="w-4 h-4" />
                 )}
                 {activeTab.toUpperCase()}
               </h3>

               <div className="space-y-4">
                 {currentContent.map((item, idx) => (
                   item.image ? (
                     <Link href="/proyectos" key={idx} className="flex items-center gap-4 group hover:bg-white p-2 rounded-xl transition-all">
                       <img src={item.image} alt={item.label} className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                       <span className="font-medium text-secondary-800 group-hover:text-primary-600 transition-colors">
                         {item.label}
                       </span>
                     </Link>
                   ) : (
                      <Link href={(item as any).link || '/proyectos'} key={idx} className="block w-full py-4 text-center bg-white border border-secondary-200 rounded-xl font-bold text-secondary-800 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
                        {item.label}
                      </Link>
                   )
                 ))}

                 {activeTab === 'suelos' && (
                    <Link href="/proyectos" className="block w-full py-4 text-center bg-white border border-secondary-200 rounded-xl font-bold text-secondary-800 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm mt-6">
                      Todos los diseños de casas
                    </Link>
                 )}
               </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-white border-l border-secondary-100 p-8">
              <h4 className="font-bold text-secondary-400 text-sm uppercase tracking-wider mb-6">
                Categorías Recomendadas
              </h4>
              
              <div className="space-y-6">
                {megaMenuData.recommended.map((item, idx) => (
                   <Link href="/proyectos" key={idx} className="flex items-start gap-3 group">
                     {idx === 0 && <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Bell className="w-4 h-4" /></div>}
                     {idx === 1 && <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><Award className="w-4 h-4" /></div>}
                     {idx === 2 && <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0"><Percent className="w-4 h-4" /></div>}
                     {idx === 3 && <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Hammer className="w-4 h-4" /></div>}
                     {idx === 4 && <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Calculator className="w-4 h-4" /></div>}
                     
                     <div>
                       <span className={`block text-sm font-bold text-secondary-900 group-hover:text-red-600 transition-colors`}>
                         {item.label}
                       </span>
                       <span className="text-xs text-secondary-500 font-medium">{item.type}</span>
                     </div>
                   </Link>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;
