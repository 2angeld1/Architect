import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Project } from '../../types';

export const useProjects = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch real projects from DB using React Query
  const { data: realProjects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (!json.success) throw new Error('Failed to load projects');
      return json.data || [];
    },
  });

  // Listen to real-time events to auto-refresh projects list
  useEffect(() => {
    const eventSource = new EventSource('/api/cms/events?page=global');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          console.log('[Realtime Projects] Updating projects list in real-time...');
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
      } catch (err) {
        console.error('Failed to parse SSE data for projects', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  // Map actual images for real projects
  const projectImages = useMemo(() => {
    const imageMap: Record<string, string> = {};
    realProjects.forEach(project => {
      if (project.images && project.images.length > 0) {
        imageMap[project.id] = project.images[0];
      } else {
        imageMap[project.id] = 'https://images.unsplash.com/photo-1600596542815-2a4d9fdb2278?auto=format&fit=crop&w=600&q=80';
      }
    });
    return imageMap;
  }, [realProjects]);

  const allProjects = useMemo(() => {
    return [...realProjects];
  }, [realProjects]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(allProjects.map(p => p.category.toLowerCase())));
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects
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
  }, [searchTerm, selectedCategory, sortBy, allProjects]);

  const handleSelectProject = (project: Project) => {
    router.push(`/proyectos/${project.id}`);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showFilters,
    setShowFilters,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    favorites,
    projectImages,
    filteredProjects,
    uniqueCategories,
    isLoading,
    handleSelectProject,
    toggleFavorite,
  };
};
