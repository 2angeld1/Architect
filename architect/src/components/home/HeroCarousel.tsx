'use client';

import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { useHeroCarousel } from '../../hooks/useHeroCarousel';
import { quickCategories } from '../../data/home';

const HeroCarousel = () => {
    const {
        slides,
        currentSlide,
        isLoading,
        nextSlide,
        prevSlide,
        goToSlide
    } = useHeroCarousel();

  if (isLoading) {
    return (
      <section className="h-screen min-h-[700px] flex items-center justify-center bg-secondary-900">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="relative h-screen min-h-[700px] max-h-[900px] overflow-hidden bg-secondary-900">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-2xl">
            {/* Slide Content */}
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-primary-500/20 backdrop-blur-sm text-primary-300 rounded-full text-sm font-medium mb-6 border border-primary-400/30">
                ✨ Proyectos Arquitectónicos Premium
              </span>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {slides[currentSlide].title}
              </h1>
              
              <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed font-sans">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Buscar proyectos..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all font-sans"
                  />
                </div>
                <Link
                  href="/proyectos"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25"
                >
                  <span>Explorar</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-3">
              {quickCategories.map((cat, index) => (
                <Link
                  key={index}
                  href="/proyectos"
                  className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200 group"
                >
                  <cat.icon className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
                  <span className="text-white font-medium">{cat.label}</span>
                  <span className="text-primary-400 text-sm">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full border border-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
                  onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary-500' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full border border-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Photo Credit */}
      {slides[currentSlide]?.credit && (
        <div className="absolute bottom-2 right-4 z-20 text-white/40 text-xs font-sans">
          Foto: {slides[currentSlide].credit} / Unsplash
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
