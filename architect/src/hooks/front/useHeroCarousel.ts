import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';

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

export const useHeroCarousel = (autoInterval = 6000, isEditMode = false) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: slides = fallbackSlides, isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['hero-carousel-slides'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/cms?page=home');
        const json = await res.json();

        if (json.success && json.formatted && Object.keys(json.formatted).length > 0) {
          const cms = json.formatted;
          return [
            {
              image: cms['hero_slide1_image'] || fallbackSlides[0].image,
              title: cms['hero_slide1_title'] || fallbackSlides[0].title,
              subtitle: cms['hero_slide1_subtitle'] || fallbackSlides[0].subtitle,
              credit: 'CMS'
            },
            {
              image: cms['hero_slide2_image'] || fallbackSlides[1].image,
              title: cms['hero_slide2_title'] || fallbackSlides[1].title,
              subtitle: cms['hero_slide2_subtitle'] || fallbackSlides[1].subtitle,
              credit: 'CMS'
            },
            {
              image: cms['hero_slide3_image'] || fallbackSlides[2].image,
              title: cms['hero_slide3_title'] || fallbackSlides[2].title,
              subtitle: cms['hero_slide3_subtitle'] || fallbackSlides[2].subtitle,
              credit: 'CMS'
            }
          ];
        }
        return fallbackSlides;
      } catch (error) {
        console.error('Error loading slides from CMS:', error);
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
    if (slides.length > 0 && !isEditMode) {
      const timer = setInterval(() => {
        nextSlide();
      }, autoInterval);
      return () => clearInterval(timer);
    }
  }, [currentSlide, slides.length, nextSlide, autoInterval, isEditMode]);

  return {
    slides,
    currentSlide,
    isLoading,
    nextSlide,
    prevSlide,
    goToSlide
  };
};
