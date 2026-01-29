import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProjects } from '../mocks/projects';
import { useCheckoutStore } from '../store/checkoutStore';
import { searchPhotos } from '../services/unsplash';
import type { Project } from '../types';

export const useProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectProject, setReservationType } = useCheckoutStore();
  
  const [project, setProject] = useState<Project | undefined>(mockProjects.find(p => p.id === id));
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'plans'>('overview');

  useEffect(() => {
    const found = mockProjects.find(p => p.id === id);
    if (found) {
      setProject(found);
      searchPhotos('modern luxury house architecture', 10).then(photos => {
        if (photos.length > 0) {
          setProjectImages(photos.map(p => `${p.urls.regular}`));
        }
      });
    } else {
      navigate('/proyectos');
    }
  }, [id, navigate]);

  const nextImage = useCallback(() => {
    if (projectImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  }, [projectImages.length]);

  const prevImage = useCallback(() => {
    if (projectImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  }, [projectImages.length]);

  const handleBuyPlan = () => {
    if (project) {
      selectProject(project);
      setReservationType('purchase');
      navigate('/checkout');
    }
  };

  const handleRequestQuote = () => {
    if (project) {
      selectProject(project);
      setReservationType('quote');
      navigate('/checkout');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return {
    project,
    projectImages,
    currentImageIndex,
    setCurrentImageIndex,
    activeTab,
    setActiveTab,
    nextImage,
    prevImage,
    handleBuyPlan,
    handleRequestQuote,
    formatPrice
  };
};
