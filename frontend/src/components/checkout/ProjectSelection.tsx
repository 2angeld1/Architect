import { useState, useEffect } from 'react';
import { Home, Ruler, Bath, Building2, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore';
import { mockProjects } from '../../mocks/projects';
import { searchPhotos } from '../../services/unsplash';
import type { Project } from '../../types';
import Reveal from '../ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';

const ProjectSelection = () => {
  const { 
    selectedProject, 
    selectProject, 
    setReservationType, 
    nextStep,
  } = useCheckoutStore();

  const [projectImages, setProjectImages] = useState<Record<string, string>>({});

  // Fetch project images
  useEffect(() => {
    const fetchImages = async () => {
      const photos = await searchPhotos('modern house architecture', 12);
      const imageMap: Record<string, string> = {};
      mockProjects.forEach((project, index) => {
        if (photos[index % photos.length]) {
          imageMap[project.id] = `${photos[index % photos.length].urls.raw}&w=400&q=80&fit=crop`;
        }
      });
      setProjectImages(imageMap);
    };
    fetchImages();
  }, []);

  const handleSelectProject = (project: Project) => {
    selectProject(project);
    setReservationType('purchase');
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
    <div className="space-y-8">
      {/* Header */}
      <Reveal variants={fadeIn}>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {mockProjects.length} proyectos disponibles
          </div>
          <h2 className="font-heading text-2xl font-bold text-secondary-900 mb-2">
            Elige tu Proyecto Ideal
          </h2>
          <p className="text-secondary-500 max-w-lg mx-auto">
            Selecciona el diseño arquitectónico que mejor se adapte a tus necesidades.
            Todos incluyen planos completos y especificaciones técnicas.
          </p>
        </div>
      </Reveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project, index) => {
          const isSelected = selectedProject?.id === project.id;
          
          return (
            <Reveal key={project.id} variants={slideUp} delay={index * 0.1}>
              <div
                onClick={() => handleSelectProject(project)}
                className={`
                  relative rounded-2xl overflow-hidden cursor-pointer
                  transition-all duration-300 group h-full flex flex-col
                  ${isSelected
                    ? 'ring-4 ring-primary-500 shadow-xl shadow-primary-500/20 scale-[1.02]'
                    : 'border-2 border-secondary-100 hover:border-primary-200 hover:shadow-lg'
                  }
                `}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-in fade-in zoom-in duration-300">
                      <Check className="w-3.5 h-3.5" />
                      Seleccionado
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  {projectImages[project.id] ? (
                    <img
                      src={projectImages[project.id]}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-primary-400" />
                    </div>
                  )}
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-0' : ''}`} />
                </div>

                <div className="p-5 bg-white flex-1 flex flex-col">
                  {/* Category badge */}
                  <div className="mb-3">
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full capitalize">
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-lg font-bold text-secondary-900 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-secondary-500 text-sm line-clamp-2 mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-secondary-100">
                    <div className="flex flex-col items-center text-center">
                      <Ruler className="w-4 h-4 text-secondary-400 mb-1" />
                      <span className="text-sm font-bold text-secondary-900">{project.area}m²</span>
                      <span className="text-xs text-secondary-400">Área</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Home className="w-4 h-4 text-secondary-400 mb-1" />
                      <span className="text-sm font-bold text-secondary-900">{project.rooms}</span>
                      <span className="text-xs text-secondary-400">Habitaciones</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Bath className="w-4 h-4 text-secondary-400 mb-1" />
                      <span className="text-sm font-bold text-secondary-900">{project.bathrooms}</span>
                      <span className="text-xs text-secondary-400">Baños</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-secondary-400">Precio del plano</span>
                      <div className="text-xl font-bold text-primary-600">
                        {formatPrice(project.price, project.currency)}
                      </div>
                    </div>
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${isSelected ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:translate-x-1'}
                    `}>
                      {isSelected ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Selected project summary & Continue button */}
      {selectedProject && (
        <Reveal variants={slideUp} className="fixed bottom-0 left-0 right-0 z-40">
          <div className="bg-white/95 backdrop-blur-md border-t border-secondary-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-inner">
                  <Building2 className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-secondary-900 text-lg">{selectedProject.name}</p>
                  <p className="text-primary-600 font-bold">
                    {formatPrice(selectedProject.price, selectedProject.currency)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
              >
                Continuar con la compra
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Spacer when bottom bar is visible */}
      {selectedProject && <div className="h-28" />}
    </div>
  );
};

export default ProjectSelection;
