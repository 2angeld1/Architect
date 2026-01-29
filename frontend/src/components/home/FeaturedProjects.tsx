import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bed, Bath, Square, Heart, MapPin, Eye } from 'lucide-react';
import { searchPhotos } from '../../services/unsplash';

interface Project {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  beds: number;
  baths: number;
  area: number;
  tag: string | null;
  location: string;
}

const baseProjects = [
  {
    id: 1,
    name: 'Casa Aurora',
    price: 2499,
    beds: 4,
    baths: 3,
    area: 220,
    tag: 'Popular',
    location: 'Ideal para terreno plano',
  },
  {
    id: 2,
    name: 'Villa Serena',
    price: 3299,
    originalPrice: 3899,
    beds: 5,
    baths: 4,
    area: 320,
    tag: 'Oferta',
    location: 'Diseño premium',
  },
  {
    id: 3,
    name: 'Casa Minimal',
    price: 1899,
    beds: 3,
    baths: 2,
    area: 160,
    tag: null,
    location: 'Compacto y funcional',
  },
  {
    id: 4,
    name: 'Residencia Luna',
    price: 4599,
    beds: 6,
    baths: 5,
    area: 450,
    tag: 'Premium',
    location: 'Gran familia',
  },
  {
    id: 5,
    name: 'Casa Jardín',
    price: 2199,
    beds: 3,
    baths: 2,
    area: 180,
    tag: 'Nuevo',
    location: 'Espacios verdes',
  },
  {
    id: 6,
    name: 'Moderno Loft',
    price: 1599,
    beds: 2,
    baths: 2,
    area: 120,
    tag: null,
    location: 'Estilo urbano',
  },
];

const FeaturedProjects = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjectImages = async () => {
      try {
        const photos = await searchPhotos('luxury modern house exterior', 6);
        if (photos.length > 0) {
          const updatedProjects = baseProjects.map((project, index) => ({
            ...project,
            image: photos[index] 
              ? `${photos[index].urls.raw}&w=700&q=85&fit=crop`
              : '', 
          }));
          setProjects(updatedProjects.filter(p => p.image !== '') as Project[]);
        }
      } catch (error) {
        console.error('Error fetching project images', error);
      }
    };
    
    fetchProjectImages();
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (projects.length === 0) return null;

  const getTagStyle = (tag: string | null) => {
    switch (tag) {
      case 'Popular':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'Nuevo':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
      case 'Premium':
        return 'bg-gradient-to-r from-violet-500 to-purple-500 text-white';
      case 'Oferta':
        return 'bg-gradient-to-r from-rose-500 to-red-500 text-white';
      default:
        return 'bg-secondary-500 text-white';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-secondary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
            <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
            Destacados
            <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-secondary-900">
            Proyectos Recomendados
          </h2>
          <p className="text-secondary-600 mt-4 max-w-2xl mx-auto text-lg">
            Nuestra selección de diseños más populares, listos para construir
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-secondary-100"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Tag */}
                {project.tag && (
                  <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${getTagStyle(project.tag)}`}>
                    {project.tag}
                  </span>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => toggleFavorite(e, project.id)}
                    className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                      favorites.includes(project.id)
                        ? 'bg-rose-500 text-white scale-110'
                        : 'bg-white/90 text-secondary-600 hover:bg-white hover:text-rose-500 hover:scale-110'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Quick View Button (appears on hover) */}
                <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                  hoveredId === project.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <Link
                    to={`/proyectos/${project.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/95 backdrop-blur-sm text-secondary-800 rounded-xl font-bold hover:bg-white transition-colors shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                    Vista rápida
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-secondary-500 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>

                {/* Name */}
                <h3 className="font-heading text-xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {project.name}
                </h3>

                {/* Features */}
                <div className="flex items-center gap-5 mb-5">
                  <div className="flex items-center gap-1.5 text-secondary-600">
                    <Bed className="w-5 h-5 text-secondary-400" />
                    <span className="font-medium">{project.beds}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-secondary-600">
                    <Bath className="w-5 h-5 text-secondary-400" />
                    <span className="font-medium">{project.baths}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-secondary-600">
                    <Square className="w-5 h-5 text-secondary-400" />
                    <span className="font-medium">{project.area} m²</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-secondary-100">
                  <div>
                    {project.originalPrice && (
                      <span className="text-secondary-400 line-through text-sm mr-2">
                        ${project.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary-600">
                      ${project.price.toLocaleString()}
                    </span>
                    <span className="text-secondary-500 text-sm ml-1">USD</span>
                  </div>
                  <Link
                    to={`/proyectos/${project.id}`}
                    className="p-3 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl transition-colors group/btn"
                  >
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/proyectos"
            className="inline-flex items-center gap-3 px-8 py-4 bg-secondary-900 hover:bg-secondary-800 text-white font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-secondary-900/20 hover:-translate-y-1 group"
          >
            <span>Explorar todos los proyectos</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
