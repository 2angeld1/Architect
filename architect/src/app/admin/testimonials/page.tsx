'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MessageSquare, Star, Trash2, Check, X, 
  Loader2, AlertCircle, Eye, EyeOff, Calendar, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { slideUp, fadeIn } from '@/animations/variants';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 1. Fetch Testimonials (Admin view)
  const { data: response, isLoading, error } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/testimonials?admin=true');
      if (!res.ok) throw new Error('Error al cargar testimonios');
      return res.json();
    },
  });

  const testimonials = response?.data || [];

  // 2. Toggle Approval Mutation
  const { mutate: toggleApproval, isPending: togglingId } = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error('Error al actualizar el estado del testimonio');
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success(variables.approved ? '¡Testimonio aprobado para el público! 🌟' : 'Testimonio ocultado del sitio público.');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al guardar los cambios.');
    }
  });

  // 3. Delete Mutation
  const { mutate: deleteTestimonial, isPending: deleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar testimonio');
      return res.json();
    },
    onSuccess: () => {
      toast.success('El testimonio ha sido eliminado físicamente.');
      setDeleteConfirmId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al eliminar.');
    }
  });

  const formatRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} 
      />
    ));
  };

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter(t => t.approved).length,
    pending: testimonials.filter(t => !t.approved).length,
    highRating: testimonials.filter(t => t.rating >= 4).length,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <p className="text-sm font-light">Cargando comentarios y opiniones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-12 text-zinc-300">
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-zinc-100 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-zinc-400" />
            <span>Testimonios & Reseñas</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Modera opiniones enviadas por tus clientes públicos y elije cuáles mostrar en la página principal.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Error al conectar con el servidor. Reintente de nuevo.</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Total Recibidos</span>
          <p className="text-2xl font-light text-zinc-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-500">Aprobados (Visibles)</span>
          <p className="text-2xl font-light text-zinc-100 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">Pendientes Moderación</span>
          <p className="text-2xl font-light text-zinc-100 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-500">Excelente (4 o 5 ★)</span>
          <p className="text-2xl font-light text-zinc-100 mt-1">{stats.highRating}</p>
        </div>
      </div>

      {/* Testimonials List / Grid */}
      {testimonials.length === 0 ? (
        <div className="text-center py-16 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
          <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto" />
          <div className="space-y-1">
            <p className="text-zinc-300 font-medium">No se han recibido testimonios todavía</p>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              Cuando un cliente envíe un testimonio desde el formulario de la página de contacto o nosotros, aparecerá aquí al instante para tu aprobación.
            </p>
          </div>
        </div>
      ) : (
        <motion.div 
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {testimonials.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-zinc-950 border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group
                  ${item.approved ? 'border-zinc-900 hover:border-zinc-800' : 'border-amber-950/40 hover:border-amber-900/40'}
                `}
              >
                {/* Pending review badge */}
                {!item.approved && (
                  <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                    Pendiente
                  </div>
                )}

                <div className="space-y-4">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {formatRating(item.rating)}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-zinc-300 font-light text-sm italic leading-relaxed bg-zinc-900/30 border border-zinc-900/50 p-4 rounded-xl">
                    "{item.comment}"
                  </p>
                </div>

                {/* Sender Details & Moderation Action Bar */}
                <div className="border-t border-zinc-900 mt-6 pt-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-200 text-sm font-semibold">{item.name}</span>
                      <span className="text-zinc-500 text-xs">{item.role || 'Cliente Particular'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Toggle Approval Button */}
                    <button
                      onClick={() => toggleApproval({ id: item.id, approved: !item.approved })}
                      title={item.approved ? 'Desaprobar y ocultar' : 'Aprobar y mostrar públicamente'}
                      className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center
                        ${item.approved 
                          ? 'bg-zinc-900 hover:bg-zinc-800/80 border-zinc-850 text-zinc-400 hover:text-zinc-300' 
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400 hover:text-emerald-300'}
                      `}
                    >
                      {item.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {/* Delete button */}
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1 bg-red-950/20 border border-red-500/20 rounded-xl p-1 animate-fadeIn">
                        <button
                          onClick={() => deleteTestimonial(item.id)}
                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded-lg transition-colors"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Eliminar testimonio"
                        className="p-2.5 rounded-xl border border-zinc-900 bg-zinc-950 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-all duration-300 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
