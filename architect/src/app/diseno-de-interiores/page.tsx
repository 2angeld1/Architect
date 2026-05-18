'use client';

import { Paintbrush } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import Reveal from '../../components/ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';
import ProjectCard from '../../components/ui/ProjectCard';
import { useCMS } from '../../hooks/useCMS';

const InteriorDesignPage = () => {
  const { filteredProjects, favorites, toggleFavorite, projectImages } = useProjects();
  const { content, isLoading } = useCMS('interiores');

  // Filtrar los proyectos que tengan categoría o estilo 'interiorismo'
  // Como fallback de demostración, tomamos algunos al azar si no hay
  const interiorProjects = filteredProjects.filter(p => 
    p.category === 'interiorismo' || p.style.toLowerCase().includes('interior')
  ).length > 0 
    ? filteredProjects.filter(p => p.category === 'interiorismo' || p.style.toLowerCase().includes('interior'))
    : filteredProjects.slice(0, 3); // Demo fallback

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-secondary-900 text-white pt-36 pb-16 relative overflow-hidden">
        {/* Background Image from CMS (if available) */}
        {content['hero_backgroundImage'] && (
          <div 
            className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url(${content['hero_backgroundImage']})` }}
          />
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-primary-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                <Paintbrush className="w-4 h-4" />
                {content['hero_badge'] || 'Nuevo Servicio'}
              </span>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                {content['hero_title'] || 'Diseño de Interiores Premium'}
              </h1>
              <p className="text-secondary-300 text-lg">
                {content['hero_subtitle'] || 'Transformamos espacios en experiencias de vida. Desde apartamentos minimalistas hasta residencias de lujo con acabados de la más alta calidad.'}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interiorProjects.map((project, idx) => (
            <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
              <ProjectCard
                project={project}
                isFavorite={favorites.includes(project.id)}
                onToggleFavorite={toggleFavorite}
                imageUrl={projectImages[project.id]}
                variant="standard"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteriorDesignPage;
