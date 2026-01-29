import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Building2, TreePine, Layers, Minimize2, Car } from 'lucide-react';
import { searchPhotos } from '../../services/unsplash';

interface Category {
  id: number;
  name: string;
  count: number;
  image: string;
  color: string;
  query: string;
  icon: React.ElementType;
}

const defaultCategories = [
  {
    id: 1,
    name: 'Casas Modernas',
    count: 125,
    color: 'from-sky-500/90 to-indigo-600/90',
    query: 'modern house architecture exterior',
    icon: Home,
  },
  {
    id: 2,
    name: 'Minimalistas',
    count: 89,
    color: 'from-emerald-500/90 to-teal-600/90',
    query: 'minimalist house design white',
    icon: Minimize2,
  },
  {
    id: 3,
    name: 'Con Jardín',
    count: 156,
    color: 'from-amber-500/90 to-orange-600/90',
    query: 'house garden backyard',
    icon: TreePine,
  },
  {
    id: 4,
    name: 'Dos Pisos',
    count: 203,
    color: 'from-rose-500/90 to-pink-600/90',
    query: 'two story modern house',
    icon: Layers,
  },
  {
    id: 5,
    name: 'Departamentos',
    count: 67,
    color: 'from-violet-500/90 to-purple-600/90',
    query: 'modern apartment building',
    icon: Building2,
  },
  {
    id: 6,
    name: 'Con Garaje',
    count: 145,
    color: 'from-cyan-500/90 to-blue-600/90',
    query: 'house with garage modern',
    icon: Car,
  },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const updatedCategories = await Promise.all(
          defaultCategories.map(async (category) => {
            const photos = await searchPhotos(category.query, 1);
            return {
              ...category,
              image: photos.length > 0 
                ? `${photos[0].urls.raw}&w=800&q=85&fit=crop` 
                : '',
            };
          })
        );
        setCategories(updatedCategories.filter(c => c.image !== '') as Category[]);
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryImages();
  }, []);

  if (isLoading || categories.length === 0) return null;

  return (
    <section id="categorias" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
              <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
              Explora por estilo
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-secondary-900">
              Categorías Populares
            </h2>
          </div>
          <Link
            to="/proyectos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full font-medium transition-colors group"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5 auto-rows-[180px] lg:auto-rows-[200px]">
          {categories.map((category, index) => {
            // Bento grid layout: first item spans 2 cols and 2 rows
            const isLarge = index === 0;
            const isMedium = index === 1 || index === 2;
            
            return (
              <Link
                key={category.id}
                to="/proyectos"
                className={`group relative overflow-hidden rounded-3xl ${
                  isLarge 
                    ? 'col-span-2 row-span-2' 
                    : isMedium 
                      ? 'col-span-2 lg:col-span-2' 
                      : 'col-span-1 lg:col-span-2'
                }`}
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                
                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-between">
                  {/* Icon Badge */}
                  <div className="self-start">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                      <category.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Text */}
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-1">
                    <h3 className={`font-heading font-bold text-white mb-1 ${isLarge ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'}`}>
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 text-sm font-medium">
                        {category.count} proyectos
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/80 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Border Glow on Hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/40 transition-colors duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
