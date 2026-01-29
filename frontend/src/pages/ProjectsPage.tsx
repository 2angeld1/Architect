import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Building2, Home, Bed, Bath, Square, Heart, Grid3X3, List, X, ChevronDown, ArrowRight } from 'lucide-react';
import { mockProjects } from '../mocks/projects';
// import { useCheckoutStore } from '../store/checkoutStore';
import { searchPhotos } from '../services/unsplash';
import type { Project, ProjectCategory } from '../types';
import Reveal from '../components/ui/Reveal';
import { slideUp, fadeIn } from '../animations/variants';

const categories: { value: ProjectCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todos', icon: Grid3X3 },
  { value: 'residencial', label: 'Residencial', icon: Home },
  { value: 'comercial', label: 'Comercial', icon: Building2 },
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  // const { selectProject, setReservationType, setCurrentStep } = useCheckoutStore(); // Unused now
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});

  // Fetch project images from Unsplash
  useEffect(() => {
    const fetchImages = async () => {
      const photos = await searchPhotos('modern house architecture', 12);
      const imageMap: Record<string, string> = {};
      mockProjects.forEach((project, index) => {
        if (photos[index % photos.length]) {
          imageMap[project.id] = `${photos[index % photos.length].urls.raw}&w=600&q=80&fit=crop`;
        }
      });
      setProjectImages(imageMap);
    };
    fetchImages();
  }, []);

  const filteredProjects = mockProjects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // newest - default order
    });

  const handleSelectProject = (project: Project) => {
    // selectProject(project); // Ya no seleccionamos globalmente aquí, se hace en el detalle
    navigate(`/proyectos/${project.id}`);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Header */}
      <div className="bg-secondary-900 text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Proyectos Arquitectónicos
              </h1>
              <p className="text-secondary-300 text-lg">
                Explora nuestra colección de más de {mockProjects.length} planos premium.
                Diseños profesionales listos para construir tu hogar ideal.
              </p>
            </div>
          </Reveal>

          {/* Search Bar */}
          <Reveal variants={slideUp} delay={0.2}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, estilo o características..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Sticky container */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-secondary-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-700 mb-3 text-sm uppercase tracking-wide">Categoría</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${selectedCategory === cat.value
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-secondary-50 text-secondary-600'
                        }`}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-700 mb-3 text-sm uppercase tracking-wide">Precio</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 hover:bg-secondary-50 rounded-xl text-left text-secondary-600 transition-colors">
                    Hasta $2,000 USD
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-secondary-50 rounded-xl text-left text-secondary-600 transition-colors">
                    $2,000 - $4,000 USD
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-secondary-50 rounded-xl text-left text-secondary-600 transition-colors">
                    Más de $4,000 USD
                  </button>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h4 className="font-medium text-secondary-700 mb-3 text-sm uppercase tracking-wide">Habitaciones</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <button
                      key={num}
                      className="px-4 py-2 bg-secondary-100 hover:bg-primary-50 hover:text-primary-700 rounded-lg text-secondary-600 font-medium transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <Reveal variants={slideUp} delay={0.4}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="text-secondary-600">
                  <span className="font-bold text-secondary-900">{filteredProjects.length}</span> proyectos encontrados
                </p>
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="appearance-none bg-white border border-secondary-200 rounded-lg px-4 py-2.5 pr-10 text-secondary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      <option value="newest">Más recientes</option>
                      <option value="price-asc">Precio: menor a mayor</option>
                      <option value="price-desc">Precio: mayor a menor</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center bg-secondary-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500'}`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Grid/List */}
            {filteredProjects.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredProjects.map((project, idx) => (
                  <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
                    <article
                      className={`group bg-white rounded-2xl overflow-hidden border border-secondary-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                        }`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-72 flex-shrink-0' : 'aspect-[4/3]'}`}>
                        {projectImages[project.id] ? (
                          <img
                            src={projectImages[project.id]}
                            alt={project.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-primary-400" />
                          </div>
                        )}

                        {/* Category Badge */}
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-secondary-700 uppercase tracking-wide">
                          {project.category}
                        </span>

                        {/* Favorite */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(project.id); }}
                          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${favorites.includes(project.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 text-secondary-600 hover:text-rose-500'
                            }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1">
                        <h3 className="font-heading text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-secondary-500 text-sm line-clamp-2 mb-4">
                          {project.description}
                        </p>

                        {/* Specs */}
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

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                          <span className="text-xl font-bold text-primary-600">
                            {formatPrice(project.price, project.currency)}
                          </span>
                          <button
                            onClick={() => handleSelectProject(project)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline transition-colors"
                          >
                            Ver detalles
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-secondary-100">
                  <Building2 className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-secondary-800 mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="text-secondary-500">
                  Intenta con otros filtros o términos de búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
