import { Link } from 'react-router-dom';
import { Bed, Bath, Square, Heart, Eye, ArrowRight, MapPin, Building2 } from 'lucide-react';
import { Project } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  imageUrl?: string;
  variant?: 'standard' | 'premium';
}

const ProjectCard = ({
  project,
  viewMode = 'grid',
  isFavorite = false,
  onToggleFavorite,
  imageUrl,
  variant = 'standard'
}: ProjectCardProps) => {
  const displayImage = imageUrl || project.images[0];
  const isList = viewMode === 'list';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(project.id);
  };

  if (variant === 'premium') {
    return (
      <article className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-secondary-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={displayImage}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {project.style && (
            <span className="absolute top-4 left-4 px-4 py-1.5 bg-primary-500 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
              {project.style}
            </span>
          )}

          <div className="absolute top-4 right-4">
            <button
              onClick={handleFavoriteClick}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                isFavorite
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-white/90 text-secondary-600 hover:bg-white hover:text-rose-500 hover:scale-110'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Link
              to={`/proyectos/${project.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/95 backdrop-blur-sm text-secondary-800 rounded-xl font-bold hover:bg-white transition-colors shadow-lg"
            >
              <Eye className="w-5 h-5" />
              Vista rápida
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1.5 text-secondary-500 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{project.style} - {project.category}</span>
          </div>

          <h3 className="font-heading text-xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>

          <div className="flex items-center gap-5 mb-5">
            <div className="flex items-center gap-1.5 text-secondary-600">
              <Bed className="w-5 h-5 text-secondary-400" />
              <span className="font-medium">{project.rooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-secondary-600">
              <Bath className="w-5 h-5 text-secondary-400" />
              <span className="font-medium">{project.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-secondary-600">
              <Square className="w-5 h-5 text-secondary-400" />
              <span className="font-medium">{project.area} m²</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-secondary-100">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(project.price, project.currency)}
            </span>
            <Link
              to={`/proyectos/${project.id}`}
              className="p-3 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl transition-colors group/btn"
            >
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden border border-secondary-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 ${
        isList ? 'flex flex-col sm:flex-row' : 'flex flex-col'
      }`}
    >
      <div className={`relative overflow-hidden ${isList ? 'sm:w-72 flex-shrink-0' : 'aspect-[4/3]'}`}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-primary-400" />
          </div>
        )}

        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-secondary-700 uppercase tracking-wide">
          {project.category}
        </span>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-secondary-600 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-heading text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
          {project.name}
        </h3>
        <p className="text-secondary-500 text-sm line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-secondary-600">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-secondary-400" />
            <span className="text-sm font-medium">{project.rooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-secondary-400" />
            <span className="text-sm font-medium">{project.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-secondary-400" />
            <span className="text-sm font-medium">{project.area}m²</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-secondary-100 mt-auto">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(project.price, project.currency)}
          </span>
          <Link
            to={`/proyectos/${project.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline transition-colors"
          >
            Ver detalles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
