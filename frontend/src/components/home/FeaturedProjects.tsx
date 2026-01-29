import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProjects } from '../../hooks/useFeaturedProjects';
import ProjectCard from '../ui/ProjectCard';
import Reveal from '../ui/Reveal';
import { slideUp } from '../../animations/variants';

const FeaturedProjects = () => {
    const {
        projects,
        favorites,
        setHoveredId,
        toggleFavorite,
    } = useFeaturedProjects();

  if (projects.length === 0) return null;

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
                  {projects.map((project, idx) => (
                      <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
                          <div
                              onMouseEnter={() => setHoveredId(project.id)}
                              onMouseLeave={() => setHoveredId(null)}
                          >
                      <ProjectCard
                          project={project}
                          variant="premium"
                          isFavorite={favorites.includes(project.id)}
                          onToggleFavorite={(id) => toggleFavorite({ preventDefault: () => { }, stopPropagation: () => { } } as any, id)}
                      />
                  </div>
              </Reveal>
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
