import { useState, useEffect } from 'react';
import { searchPhotos } from '../services/unsplash';
import { mockProjects } from '../mocks/projects';
import { Project } from '../types';

export const useFeaturedProjects = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectImages = async () => {
      try {
        // Take first 6 projects from mock data as featured
        const featuredBase = mockProjects.slice(0, 6);
        const photos = await searchPhotos('luxury modern house exterior', 6);
        
        if (photos.length > 0) {
          const updatedProjects = featuredBase.map((project, index) => ({
            ...project,
            images: [
              photos[index] 
                ? `${photos[index].urls.raw}&w=700&q=85&fit=crop`
                : project.images[0],
              ...project.images.slice(1)
            ],
          }));
          setProjects(updatedProjects);
        } else {
          setProjects(featuredBase);
        }
      } catch (error) {
        console.error('Error fetching project images', error);
        setProjects(mockProjects.slice(0, 6));
      }
    };
    
    fetchProjectImages();
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return {
    projects,
    favorites,
    hoveredId,
    setHoveredId,
    toggleFavorite,
  };
};
