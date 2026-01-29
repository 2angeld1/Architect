import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/home';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mt-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-secondary-600 mt-3 max-w-2xl mx-auto">
            Miles de familias ya confiaron en nosotros para construir su hogar
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="flex items-center justify-center">
            {/* Navigation - Left */}
            <button
              onClick={prevTestimonial}
              className="hidden md:flex absolute left-0 z-10 p-3 bg-white shadow-lg rounded-full border border-secondary-100 hover:border-primary-300 hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-secondary-600" />
            </button>

            {/* Cards Container */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative h-[400px] md:h-[320px]">
                {testimonials.map((testimonial, index) => {
                  const offset = index - activeIndex;
                  const isActive = index === activeIndex;
                  
                  return (
                    <div
                      key={testimonial.id}
                      className={`absolute inset-0 transition-all duration-500 ${
                        isActive 
                          ? 'opacity-100 translate-x-0 scale-100 z-20' 
                          : offset === 1 || offset === -(testimonials.length - 1)
                            ? 'opacity-40 translate-x-24 scale-90 z-10'
                            : offset === -1 || offset === (testimonials.length - 1)
                              ? 'opacity-40 -translate-x-24 scale-90 z-10'
                              : 'opacity-0 scale-75 z-0'
                      }`}
                    >
                      <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8 lg:p-10 h-full">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-8 text-primary-100">
                          <Quote className="w-16 h-16" />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        {/* Content */}
                        <p className="text-secondary-700 text-lg leading-relaxed mb-8 relative z-10">
                          "{testimonial.content}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-14 h-14 rounded-full object-cover ring-4 ring-primary-100"
                          />
                          <div>
                            <h4 className="font-heading font-bold text-secondary-800">
                              {testimonial.name}
                            </h4>
                            <p className="text-secondary-500 text-sm">
                              {testimonial.role} • {testimonial.project}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation - Right */}
            <button
              onClick={nextTestimonial}
              className="hidden md:flex absolute right-0 z-10 p-3 bg-white shadow-lg rounded-full border border-secondary-100 hover:border-primary-300 hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-secondary-600" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white shadow-lg rounded-full border border-secondary-100"
            >
              <ChevronLeft className="w-5 h-5 text-secondary-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 bg-white shadow-lg rounded-full border border-secondary-100"
            >
              <ChevronRight className="w-5 h-5 text-secondary-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-primary-500' 
                    : 'w-2 bg-secondary-300 hover:bg-secondary-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
