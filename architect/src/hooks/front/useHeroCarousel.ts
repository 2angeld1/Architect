import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { searchPhotos, type UnsplashPhoto } from '../../services/unsplash';
import { heroSlideContent } from '../../data/home';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  credit?: string;
}

const fallbackSlides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&fit=crop',
    title: 'Diseña tu Hogar Ideal',
    subtitle: 'Más de 500 proyectos arquitectónicos listos para construir',
    credit: 'R-Architecture'
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&fit=crop',
    title: 'Arquitectura Moderna',
    subtitle: 'Planos detallados con las últimas tendencias de diseño',
    credit: 'R-Architecture'
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80&fit=crop',
    title: 'Tu Proyecto, Tu Estilo',
    subtitle: 'Casas modernas, clásicas y contemporáneas',
    credit: 'R-Architecture'
  }
];

export const useHeroCarousel = (autoInterval = 6000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: slides = fallbackSlides, isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['hero-carousel-slides'],
    queryFn: async () => {
      try {
        const photos = await searchPhotos('modern house architecture', 3);
        if (photos && photos.length > 0) {
          return photos.map((photo: UnsplashPhoto, index: number) => ({
            image: `${photo.urls.raw}&w=1920&q=80&fit=crop`,
            title: heroSlideContent[index % heroSlideContent.length].title,
            subtitle: heroSlideContent[index % heroSlideContent.length].subtitle,
            credit: photo.user.name,
          }));
        }
        return fallbackSlides;
      } catch (error) {
        console.error('Error loading images from Unsplash, loading fallbacks:', error);
        return fallbackSlides;
      }
    },
  });

  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        nextSlide();
      }, autoInterval);
      return () => clearInterval(timer);
    }
  }, [currentSlide, slides.length, nextSlide, autoInterval]);

  return {
    slides,
    currentSlide,
    isLoading,
    nextSlide,
    prevSlide,
    goToSlide
  };
};
