import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProjects } from '../mocks/projects';
import { searchPhotos } from '../services/unsplash';
import type { Project, ProjectCategory } from '../types';

export const useProjects = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const photos = await searchPhotos('modern house architecture', 12);
      const imageMap: Record<string, string> = {};
      mockProjects.forEach((project, index) => {
        if (photos[index % photos.length]) {
          imageMap[project.id] = `${photos[index % photos.length].urls.raw}&w=600&q=80&fit=crop`;
        }
      });
      setProjectImages(imageMap);
    };
    fetchImages();
  }, []);

  const filteredProjects = useMemo(() => {
    return mockProjects
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
    navigate(`/proyectos/${project.id}`);
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
    handleSelectProject,
    toggleFavorite,
  };
};
