import { Home, Ruler, Bath, Building2, Check, MessageSquareQuote } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import { mockProjects } from '../../data/mockProjects';
import type { Project } from '../../types';

const ProjectSelection = () => {
  const { 
    selectedProject, 
    selectProject, 
    setReservationType, 
    nextStep,
    reservationType 
  } = useCheckoutStore();

  const handleSelectProject = (project: Project) => {
    selectProject(project);
    setReservationType('purchase');
  };

  const handleQuoteRequest = (project: Project) => {
    selectProject(project);
    setReservationType('quote');
    nextStep();
  };

  const handleContinue = () => {
    if (selectedProject) {
      nextStep();
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-secondary-800 mb-2">
          Selecciona un Proyecto
        </h2>
        <p className="text-secondary-600">
          Elige el proyecto arquitectónico que deseas adquirir o solicita una cotización personalizada.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => {
          const isSelected = selectedProject?.id === project.id;
          
          return (
            <div
              key={project.id}
              className={`
                card-hover relative
                ${isSelected ? 'ring-2 ring-primary-500 border-primary-500' : ''}
              `}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Seleccionado
                  </span>
                </div>
              )}

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

                {/* Price */}
                <div className="text-xl font-bold text-primary-600 mb-4">
                  {formatPrice(project.price, project.currency)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectProject(project)}
                    className={`
                      flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all
                      ${isSelected 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                      }
                    `}
                  >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                  </button>
                  <button
                    onClick={() => handleQuoteRequest(project)}
                    className="py-2 px-3 rounded-lg border border-secondary-300 text-secondary-600 hover:bg-secondary-50 transition-all"
                    title="Solicitar cotización"
                  >
                    <MessageSquareQuote className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected project summary & Continue button */}
      {selectedProject && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 shadow-lg p-4 z-40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-secondary-800">{selectedProject.name}</p>
                <p className="text-primary-600 font-bold">
                  {formatPrice(selectedProject.price, selectedProject.currency)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary-500">
                {reservationType === 'quote' ? 'Cotización' : 'Compra directa'}
              </span>
              <button
                onClick={handleContinue}
                className="btn-primary"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer when bottom bar is visible */}
      {selectedProject && <div className="h-24" />}
    </div>
  );
};

export default ProjectSelection;
