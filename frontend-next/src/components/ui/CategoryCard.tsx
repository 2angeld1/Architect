import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  id: string | number;
  name: string;
  image: string;
  count: number;
  icon: LucideIcon;
  color?: string;
  description?: string;
  subcategories?: string[];
  variant?: 'grid' | 'bento';
  isLarge?: boolean;
  isMedium?: boolean;
}

const CategoryCard = ({
  id,
  name,
  image,
  count,
  icon: Icon,
  color = 'from-secondary-900/80 to-secondary-900/40',
  description,
  subcategories = [],
  variant = 'grid',
  isLarge = false,
  isMedium = false
}: CategoryCardProps) => {
  if (variant === 'bento') {
    return (
      <Link
        href={`/categorias/${id}`}
        className={`group relative overflow-hidden rounded-3xl ${
          isLarge 
            ? 'col-span-2 row-span-2' 
            : isMedium 
              ? 'col-span-2 lg:col-span-2' 
              : 'col-span-1 lg:col-span-2'
        }`}
      >
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
        
        <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-between">
          <div className="self-start">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
              <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
          </div>
          
          <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-1">
            <h3 className={`font-heading font-bold text-white mb-1 ${isLarge ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'}`}>
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-white/90 text-sm font-medium">
                {count} proyectos
              </span>
              <ArrowRight className="w-4 h-4 text-white/80 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/40 transition-colors duration-300 pointer-events-none" />
      </Link>
    );
  }

  return (
    <Link
      href={`/categorias/${id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-secondary-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        
        <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="text-white font-bold text-2xl">{count}</span>
          <span className="text-white/80 ml-1">proyectos</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-heading text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-secondary-500 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {subcategories.slice(0, 3).map((sub, idx) => (
              <span 
                key={idx}
                className="text-xs bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full"
              >
                {sub}
              </span>
            ))}
            {subcategories.length > 3 && (
              <span className="text-xs text-secondary-400">
                +{subcategories.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center text-primary-600 font-medium group-hover:underline">
          <span>Explorar categoría</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
