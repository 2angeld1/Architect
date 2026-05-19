'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { testimonials as fallbackTestimonials } from '../../data/home';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Testimonial {
  id: string | number;
  name: string;
  role: string | null;
  rating: number;
  comment: string;
  avatar?: string;
}

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  // 1. Fetch approved 4/5 star testimonials dynamically
  const { data: dbResponse } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('Failed to load testimonials');
      return res.json();
    },
  });

  // Map db testimonials to match slider format, fall back to hardcoded ones if DB is empty
  const dbTestimonials = dbResponse?.data || [];
  const list = dbTestimonials.length > 0 
    ? dbTestimonials.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role || 'Cliente Particular',
        content: t.comment,
        rating: t.rating,
        avatar: undefined as string | undefined,
      }))
    : fallbackTestimonials.map(t => ({
        id: t.id,
        name: t.name,
        role: `${t.role} • ${t.project}`,
        content: t.content,
        rating: t.rating,
        avatar: t.avatar,
      }));

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % list.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  // 2. Submit Testimonial Mutation
  const { mutate: submitTestimonial, isPending: submitting } = useMutation({
    mutationFn: async (data: { name: string; role?: string; rating: number; comment: string }) => {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit testimonial');
      return resData;
    },
    onSuccess: () => {
      toast.success('¡Testimonio enviado! Fue remitido al correo y se mostrará tras moderación. ✨', {
        duration: 6000,
      });
      // Reset form and close modal
      setName('');
      setRole('');
      setRating(5);
      setComment('');
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al enviar el testimonio. Inténtalo de nuevo.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Por favor escribe tu nombre.');
    if (!comment.trim()) return toast.error('Por favor escribe tu comentario.');
    submitTestimonial({
      name: name.trim(),
      role: role.trim() || undefined,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <section className="py-20 bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left md:max-w-2xl">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">
              Testimonios
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mt-2">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-secondary-600 mt-3">
              Miles de familias ya confiaron en nosotros para diseñar y construir el hogar de sus sueños.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-primary-400" />
            <span>Escribir una Reseña</span>
          </button>
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
              <div className="relative h-[420px] md:h-[320px]">
                {list.map((testimonial, index) => {
                  const offset = index - activeIndex;
                  const isActive = index === activeIndex;
                  
                  return (
                    <div
                      key={testimonial.id}
                      className={`absolute inset-0 transition-all duration-500 ${
                        isActive 
                          ? 'opacity-100 translate-x-0 scale-100 z-20' 
                          : offset === 1 || offset === -(list.length - 1)
                            ? 'opacity-40 translate-x-24 scale-90 z-10'
                            : offset === -1 || offset === (list.length - 1)
                              ? 'opacity-40 -translate-x-24 scale-90 z-10'
                              : 'opacity-0 scale-75 z-0'
                      }`}
                    >
                      <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8 lg:p-10 h-full flex flex-col justify-between">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-8 text-primary-100">
                          <Quote className="w-16 h-16" />
                        </div>

                        <div>
                          {/* Stars */}
                          <div className="flex gap-1 mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>

                          {/* Content */}
                          <p className="text-secondary-700 text-base md:text-lg leading-relaxed mb-6 relative z-10 font-light italic">
                            "{testimonial.content}"
                          </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-14 h-14 rounded-full object-cover ring-4 ring-primary-500/10 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary-500 to-amber-500 text-white font-bold text-lg ring-4 ring-primary-500/10 uppercase shrink-0">
                              {testimonial.name[0]}
                            </div>
                          )}
                          <div>
                            <h4 className="font-heading font-bold text-secondary-800">
                              {testimonial.name}
                            </h4>
                            <p className="text-secondary-500 text-sm">
                              {testimonial.role}
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
            {list.map((_, index) => (
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

      {/* Testimonial Writer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-secondary-100 shadow-2xl p-6 md:p-8 w-full max-w-lg relative overflow-hidden text-zinc-800"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                <h3 className="text-xl font-bold font-heading text-secondary-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                  Escribe tu Reseña
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-50 hover:text-secondary-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                {/* Star Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Tu Calificación
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isHighlighted = val <= (hoverRating !== null ? hoverRating : rating);
                      return (
                        <button
                          key={val}
                          type="button"
                          onMouseEnter={() => setHoverRating(val)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(val)}
                          className="p-1 transition-transform active:scale-90"
                        >
                          <Star 
                            className={`w-8 h-8 transition-colors duration-200
                              ${isHighlighted ? 'text-amber-400 fill-amber-400' : 'text-secondary-200'}
                            `}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                {/* Role / Occupation / Company */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Empresa / Puesto o Profesión (Opcional)
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ej. Propietario de Casa Aurora / Ingeniero"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Tu Testimonio / Comentario
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos tu experiencia trabajando con nosotros..."
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-black/10 flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Enviar Testimonio</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
