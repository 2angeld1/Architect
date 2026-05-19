import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { searchPhotos } from '../../services/unsplash';
import { mockProjects } from '../../mocks/projects';
import { Project } from '../../types';

export const useFeaturedProjects = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['featured-projects-home'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error('Failed to fetch projects');
        const allProjects: Project[] = json.data || [];
        
        // Filter by isFeatured and isActive
        const featured = allProjects.filter((p: any) => p.isFeatured && p.isActive);
        
        // If there are no featured projects in the DB yet, fall back to mock projects
        if (featured.length === 0) {
          return mockProjects.slice(0, 6);
        }
        return featured;
      } catch (error) {
        console.error('Error fetching featured projects', error);
        return mockProjects.slice(0, 6);
      }
    },
  });

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
    isLoading
  };
};
