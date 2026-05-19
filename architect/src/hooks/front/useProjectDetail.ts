import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import { mockProjects } from '../../mocks/projects';
import { useCheckoutStore } from '../../store/checkoutStore';
import { searchPhotos } from '../../services/unsplash';
import type { Project } from '../../types';

export const useProjectDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { selectProject, setReservationType } = useCheckoutStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'plans'>('overview');

  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id);
  }, [id]);

  // Fetch Unsplash photos for gallery using React Query
  const { data: projectImages = [], isLoading } = useQuery<string[]>({
    queryKey: ['project-detail-photos', id],
    queryFn: async () => {
      if (!project) return [];
      const photos = await searchPhotos('modern luxury house architecture', 10);
      return photos.map(p => `${p.urls.regular}`);
    },
    enabled: !!project,
  });

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
      router.push('/checkout');
    }
  };

  const handleRequestQuote = () => {
    if (project) {
      selectProject(project);
      setReservationType('quote');
      router.push('/checkout');
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
    formatPrice,
    isLoading
  };
};
