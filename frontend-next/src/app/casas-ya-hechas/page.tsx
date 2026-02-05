'use client';

import { Home } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import Reveal from '../../components/ui/Reveal';
import { fadeIn, slideUp } from '../../animations/variants';
import ProjectCard from '../../components/ui/ProjectCard';

const ReadyMadeHousesPage = () => {
  const { filteredProjects, favorites, toggleFavorite, projectImages } = useProjects();

  // For demo purposes, we'll just take the second half of projects
  // In a real app, this would filter by status='built' or similar
  const readyMadeProjects = filteredProjects.slice(filteredProjects.length / 2);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-secondary-900 text-white pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-primary-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                <Home className="w-4 h-4" />
                Entrega Inmediata
              </span>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Casas Ya Hechas
              </h1>
              <p className="text-secondary-300 text-lg">
                Propiedades terminadas listas para habitar. Sin esperas de construcción, 
                ideales para quienes buscan mudarse de inmediato.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {readyMadeProjects.map((project, idx) => (
            <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
              <ProjectCard
                project={project}
                isFavorite={favorites.includes(project.id)}
                onToggleFavorite={toggleFavorite}
                imageUrl={projectImages[project.id]}
                variant="standard" // Standard variant for this list
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadyMadeHousesPage;
