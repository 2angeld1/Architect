'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

import CloudinaryUploader from '../CloudinaryUploader';

type ProjectFormData = {
  name: string;
  category: string;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  floors: number;
  style: string;
  description: string;
  images: string[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit, isLoading }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([
    'Residencial',
    'Apartamento / Loft',
    'Diseño de Interiores',
    'Comercial',
    'Industrial',
    'Institucional',
    'Mixto'
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/cms?page=global');
        const json = await res.json();
        if (json.success && json.formatted && json.formatted.categories_list) {
          const parsed = JSON.parse(json.formatted.categories_list);
          if (Array.isArray(parsed)) {
            const names = parsed.map((c: any) => c.name);
            if (names.length > 0) {
              setDynamicCategories(names);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching categories in ProjectFormModal:', err);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      category: 'residencial',
      floors: 1,
      images: []
    }
  });

  const handleFormSubmit = (data: ProjectFormData) => {
    const finalData = {
      ...data,
      images: imageUrl ? [imageUrl] : []
    };
    onSubmit(finalData);
    if (!isLoading) {
      reset();
      setImageUrl(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-zinc-950 border-l border-zinc-800/80 shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-light text-white">Nuevo Proyecto</h2>
                  <p className="text-sm text-zinc-500 mt-1">Ingresa los detalles y planos del diseño arquitectónico.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                
                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2">Planos / Foto Principal</h3>
                  <CloudinaryUploader 
                    currentImage={imageUrl}
                    onUpload={(url: string) => setImageUrl(url)}
                    onRemove={() => setImageUrl(null)}
                    label="Portada del Proyecto"
                  />
                </div>

                {/* Basic Info */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2">Información Básica</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Nombre del Proyecto</label>
                      <input 
                        {...register('name', { required: 'El nombre es obligatorio' })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 outline-none"
                        placeholder="Ej. Casa Vistamar"
                      />
                      {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name.message}</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Categoría</label>
                      <input 
                        list="category-options"
                        {...register('category', { required: 'La categoría es obligatoria' })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-zinc-600 outline-none"
                        placeholder="Ej. Residencial, Museo, Rascacielos..."
                      />
                      <datalist id="category-options">
                        {dynamicCategories.map((cat, idx) => (
                          <option key={idx} value={cat} />
                        ))}
                      </datalist>
                      {errors.category && <span className="text-red-400 text-xs mt-1">{errors.category.message}</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Precio Estimado (USD)</label>
                      <input 
                        type="number"
                        {...register('price', { required: 'Precio es obligatorio', valueAsNumber: true })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-zinc-600 outline-none"
                        placeholder="Ej. 150000"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2">Características (Planos)</h3>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Pisos</label>
                      <input 
                        type="number"
                        {...register('floors', { valueAsNumber: true })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Área (m²)</label>
                      <input 
                        type="number"
                        {...register('area', { valueAsNumber: true })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Estilo</label>
                      <input 
                        {...register('style')}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none"
                        placeholder="Ej. Minimalista..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Habitaciones</label>
                      <input 
                        type="number"
                        {...register('rooms', { valueAsNumber: true })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Baños</label>
                      <input 
                        type="number"
                        {...register('bathrooms', { valueAsNumber: true })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Descripción del Proyecto</label>
                    <textarea 
                      {...register('description')}
                      rows={4}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none resize-none"
                      placeholder="Describe la visión arquitectónica..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 flex justify-end gap-3 border-t border-zinc-800/80">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Guardando...' : 'Crear Proyecto'}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
