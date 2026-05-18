import { useState, useEffect, useCallback } from 'react';
import { searchPhotos, type UnsplashPhoto } from '../services/unsplash';
import { heroSlideContent } from '../data/home';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  credit?: string;
}

export const useHeroCarousel = (autoInterval = 6000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const photos = await searchPhotos('modern house architecture', 3);
        if (photos.length > 0) {
          const newSlides = photos.map((photo: UnsplashPhoto, index: number) => ({
            image: `${photo.urls.raw}&w=1920&q=80&fit=crop`,
            title: heroSlideContent[index % heroSlideContent.length].title,
            subtitle: heroSlideContent[index % heroSlideContent.length].subtitle,
            credit: photo.user.name,
          }));
          setSlides(newSlides);
        }
      } catch (error) {
        console.error('Error loading images', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

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
