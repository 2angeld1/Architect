import { Percent } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import Reveal from '../components/ui/Reveal';
import { fadeIn, slideUp } from '../animations/variants';
import ProjectCard from '../components/ui/ProjectCard';

const PromotionsPage = () => {
  const { filteredProjects, favorites, toggleFavorite, projectImages } = useProjects();
  
  // Filter projects that have an originalPrice (indicating a discount)
  const promoProjects = filteredProjects.filter(p => p.originalPrice);
  // If no specific promo projects in mock, just take some for demo
  const displayProjects = promoProjects.length > 0 ? promoProjects : filteredProjects.slice(0, 4).map(p => ({
    ...p,
    originalPrice: p.price * 1.2 // Fake discount for demo
  }));

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                <Percent className="w-4 h-4" />
                Ofertas Especiales
              </span>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Promociones Exclusivas
              </h1>
              <p className="text-rose-100 text-lg">
                Diseños de casas premium a precios increíbles. Aprovecha estas oportunidades por tiempo limitado.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, idx) => (
            <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
              <ProjectCard
                project={project}
                isFavorite={favorites.includes(project.id)}
                onToggleFavorite={toggleFavorite}
                imageUrl={projectImages[project.id]}
                variant="premium"
              />
            </Reveal>
          ))}
        </div>
        
        {displayProjects.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-secondary-900">No hay promociones activas en este momento.</h3>
            <p className="text-secondary-500 mt-2">Vuelve a visitarnos pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
