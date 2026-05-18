import { useState, useEffect } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';
import { mockProjects } from '../mocks/projects';
import { searchPhotos } from '../services/unsplash';
import type { Project } from '../types';

export const useProjectSelection = () => {
  const { 
    selectedProject, 
    selectProject, 
    setReservationType, 
    nextStep,
  } = useCheckoutStore();

  const [projectImages, setProjectImages] = useState<Record<string, string>>({});

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

  return {
    selectedProject,
    projectImages,
    handleSelectProject,
    handleContinue,
    formatPrice
  };
};
