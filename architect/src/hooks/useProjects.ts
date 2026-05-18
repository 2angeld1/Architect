import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockProjects } from '../mocks/projects';
import { searchPhotos } from '../services/unsplash';
import type { Project } from '../types';

export const useProjects = () => {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [realProjects, setRealProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real projects from DB
  useEffect(() => {
    const fetchRealProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        if (json.success && json.data) {
          setRealProjects(json.data);
        }
      } catch (err) {
        console.error('Error fetching real projects:', err);
      }
    };
    fetchRealProjects();
  }, []);

  // Handle Unsplash images for mocks, and real images for real projects
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      const photos = await searchPhotos('modern house architecture', 12);
      const imageMap: Record<string, string> = {};
      
      // Assign Unsplash images to mocks
      mockProjects.forEach((project, index) => {
        if (photos[index % photos.length]) {
          imageMap[project.id] = `${photos[index % photos.length].urls.raw}&w=600&q=80&fit=crop`;
        }
      });

      // Assign actual images to real projects
      realProjects.forEach(project => {
        if (project.images && project.images.length > 0) {
          imageMap[project.id] = project.images[0];
        } else {
          imageMap[project.id] = 'https://images.unsplash.com/photo-1600596542815-2a4d9fdb2278?auto=format&fit=crop&w=600&q=80';
        }
      });

      setProjectImages(imageMap);
      setIsLoading(false);
    };
    fetchImages();
  }, [realProjects]);

  const allProjects = useMemo(() => {
    // Avoid duplicate IDs just in case, though unlikely
    return [...realProjects, ...mockProjects];
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
  }, [searchTerm, selectedCategory, sortBy]);

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
