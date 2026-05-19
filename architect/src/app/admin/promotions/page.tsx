'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Percent, 
  DollarSign, 
  Calendar, 
  Trash2, 
  Plus, 
  Volume2, 
  Save, 
  Loader2, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function PromotionsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  // New Coupon Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Fetch Coupons
  const { data: coupons = [], isLoading: isLoadingCoupons } = useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await fetch('/api/coupons');
      const json = await res.json();
      return json.success ? json.data : [];
    },
  });

  // Fetch Global CMS (for Promo Banner)
  const { data: globalCMS = {}, isLoading: isLoadingCMS } = useQuery<Record<string, string>>({
    queryKey: ['cms', 'global'],
    queryFn: async () => {
      const res = await fetch('/api/cms?page=global');
      const json = await res.json();
      if (!json.success) return {};
      // Convert PageContent array to key-value record
      const record: Record<string, string> = {};
      json.data.forEach((item: any) => {
        record[item.key] = item.value;
      });
      return record;
    },
  });

  // Promo Banner State
  const [bannerActive, setBannerActive] = React.useState<boolean>(false);
  const [bannerText, setBannerText] = React.useState<string>('');
  const [bannerCode, setBannerCode] = React.useState<string>('');

  React.useEffect(() => {
    if (globalCMS && Object.keys(globalCMS).length > 0) {
      setBannerActive(globalCMS.promo_banner_active === 'true');
      setBannerText(globalCMS.promo_banner_text || '');
      setBannerCode(globalCMS.promo_banner_code || '');
    }
  }, [globalCMS]);

  // Save Promo Banner Mutation
  const saveBannerMutation = useMutation({
    mutationFn: async () => {
      const keys = [
        { key: 'promo_banner_active', value: String(bannerActive) },
        { key: 'promo_banner_text', value: bannerText },
        { key: 'promo_banner_code', value: bannerCode },
      ];

      for (const item of keys) {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'global',
            section: 'announcement',
            key: item.key,
            value: item.value,
            type: 'text',
          }),
        });
        if (!res.ok) throw new Error('Error al guardar el banner');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'global'] });
      toast.success('¡Anuncio de promoción guardado correctamente!');
    },
    onError: () => {
      toast.error('Error al guardar el anuncio de promoción.');
    },
  });

  // Create Coupon Mutation
  const createCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
          discountType,
          value: parseFloat(value),
          expiresAt: expiresAt || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al crear el cupón');
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('¡Cupón creado con éxito!');
      setIsAdding(false);
      setCode('');
      setValue('');
      setExpiresAt('');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al crear el cupón');
    },
  });

  // Toggle Coupon Mutation
  const toggleCouponMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Error al actualizar el cupón');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Estado del cupón actualizado');
    },
  });

  // Delete Coupon Mutation
  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar el cupón');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Cupón eliminado correctamente');
    },
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return toast.error('El código es obligatorio');
    if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      return toast.error('El valor debe ser un número positivo');
    }
    if (discountType === 'percentage' && parseFloat(value) > 100) {
      return toast.error('El porcentaje de descuento no puede ser mayor a 100%');
    }
    createCouponMutation.mutate();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight font-heading">Promociones y Cupones</h1>
          <p className="text-zinc-500 text-sm mt-1">Configura ofertas globales y cupones de descuento para tus compradores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Promotion Announcement Banner Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute -inset-x-20 -top-20 h-40 w-full bg-gradient-to-b from-amber-500/5 to-transparent opacity-100 blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Volume2 className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Anuncio Global</h3>
                  <p className="text-xs text-zinc-500">Muestra una barra de promoción en todo el sitio.</p>
                </div>
              </div>

              {/* Toggle switch */}
              <div className="flex items-center justify-between p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/50">
                <span className="text-sm font-medium text-zinc-300">Mostrar Banner</span>
                <button
                  onClick={() => setBannerActive(!bannerActive)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                    bannerActive ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    bannerActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Texto del Anuncio</label>
                <textarea
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="Ej. ¡OFERTA LIMITADA! Obtén 20% de descuento usando el cupón PLAN20"
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm font-sans"
                />
              </div>

              {/* Code link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cupón Asociado</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={bannerCode}
                    onChange={(e) => setBannerCode(e.target.value)}
                    placeholder="Ej. PLAN20"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm font-sans uppercase font-bold tracking-wider"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => saveBannerMutation.mutate()}
                disabled={saveBannerMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {saveBannerMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Coupons List & Operations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Cupones de Descuento</h3>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm rounded-xl transition-all"
            >
              {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isAdding ? 'Cancelar' : 'Nuevo Cupón'}</span>
            </button>
          </div>

          {/* New Coupon Card */}
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden"
            >
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Código del Cupón</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ej. ARCHI15"
                      className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm font-sans uppercase font-bold tracking-wider"
                    />
                  </div>

                  {/* Discount Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tipo de Descuento</label>
                    <select
                      value={discountType}
                      onChange={(e: any) => setDiscountType(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm font-sans"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto Fijo (USD)</option>
                    </select>
                  </div>

                  {/* Value */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Valor del Descuento</label>
                    <div className="relative">
                      {discountType === 'percentage' ? (
                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      ) : (
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      )}
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={discountType === 'percentage' ? 'Ej. 15' : 'Ej. 100'}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm font-sans"
                      />
                    </div>
                  </div>

                  {/* Expiration Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fecha de Expiración (Opcional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm font-sans"
                      />
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-medium text-sm rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createCouponMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    {createCouponMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Crear Cupón</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Coupons Table */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden">
            {isLoadingCoupons ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mb-4" />
                <span className="text-sm">Cargando cupones activos...</span>
              </div>
            ) : coupons.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500 space-y-3">
                <Tag className="w-12 h-12 text-zinc-700" />
                <span className="text-sm">No tienes cupones de descuento creados aún.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-900/40">
                      <th className="px-6 py-4">Código</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Descuento</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Vence el</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-sm">
                    {coupons.map((coupon) => {
                      const hasExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
                      return (
                        <tr key={coupon.id} className="hover:bg-zinc-900/10 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold tracking-wider text-zinc-100 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-zinc-400 capitalize">
                            {coupon.discountType === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}
                          </td>
                          <td className="px-6 py-4 font-semibold text-white">
                            {coupon.discountType === 'percentage' ? `${coupon.value}%` : `$${coupon.value} USD`}
                          </td>
                          <td className="px-6 py-4">
                            {hasExpired ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                Expirado
                              </span>
                            ) : (
                              <button
                                onClick={() => toggleCouponMutation.mutate({ id: coupon.id, isActive: !coupon.isActive })}
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all focus:outline-none border ${
                                  coupon.isActive 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                    : 'bg-zinc-800/40 text-zinc-500 border-zinc-800/80 hover:bg-zinc-800/60'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                                {coupon.isActive ? 'Activo' : 'Desactivado'}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-zinc-400 font-sans">
                            {coupon.expiresAt ? (
                              new Date(coupon.expiresAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Estás seguro de que deseas eliminar el cupón ${coupon.code}?`)) {
                                  deleteCouponMutation.mutate(coupon.id);
                                }
                              }}
                              className="text-zinc-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all focus:outline-none active:scale-95"
                              title="Eliminar cupón"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
