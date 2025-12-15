import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Building2, Home, Ruler, Bath, X } from 'lucide-react';
import { mockProjects } from '../data/mockProjects';
import { useCheckoutStore } from '../store/checkoutStore';
import type { Project, ProjectCategory } from '../types';

const categories: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'mixto', label: 'Mixto' },
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { selectProject, setReservationType, setCurrentStep } = useCheckoutStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesPrice = project.price >= priceRange[0] && project.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleSelectProject = (project: Project) => {
    selectProject(project);
    setReservationType('purchase');
    setCurrentStep('buyer-info');
    navigate('/checkout');
  };

  const handleRequestQuote = (project: Project) => {
    selectProject(project);
    setReservationType('quote');
    setCurrentStep('buyer-info');
    navigate('/checkout');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mb-4">
            Proyectos Arquitectónicos
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Explora nuestra colección de planos y proyectos. Encuentra el diseño perfecto
            para tu próxima construcción.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>

            {/* Category filters (desktop) */}
            <div className="hidden lg:flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedCategory === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filters panel */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-white rounded-lg border border-secondary-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-secondary-800">Filtros</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-secondary-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ProjectCategory | 'all')}
                    className="input"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="text-secondary-500 text-sm mb-6">
          Mostrando {filteredProjects.length} proyectos
        </p>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="card-hover">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary-400" />
                </div>

                <div className="p-5">
                  {/* Category badge */}
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full capitalize">
                    {project.category}
                  </span>

                  {/* Title & Description */}
                  <h3 className="font-heading text-lg font-semibold text-secondary-800 mt-3 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-secondary-600 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs text-secondary-500">
                      <Ruler className="w-4 h-4" />
                      <span>{project.area}m²</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-secondary-500">
                      <Home className="w-4 h-4" />
                      <span>{project.rooms} hab.</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-secondary-500">
                      <Bath className="w-4 h-4" />
                      <span>{project.bathrooms} baños</span>
                    </div>
                  </div>

                  {/* Features preview */}
                  <div className="mb-4">
                    <p className="text-xs text-secondary-400 mb-2">Incluye:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {project.features.length > 3 && (
                        <span className="text-xs text-secondary-400">
                          +{project.features.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-xl font-bold text-primary-600 mb-4">
                    {formatPrice(project.price, project.currency)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectProject(project)}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      Comprar
                    </button>
                    <button
                      onClick={() => handleRequestQuote(project)}
                      className="flex-1 btn-outline text-sm py-2"
                    >
                      Cotizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-600 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-secondary-500">
              Intenta con otros filtros o términos de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
