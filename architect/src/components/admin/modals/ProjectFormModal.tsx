'use client';
import { Save } from 'lucide-react';
import CloudinaryUploader from '../CloudinaryUploader';
import { useProjectFormModal, ProjectFormData } from '../../../hooks/admin/useProjectFormModal';
import AdminDrawer from '../shared/AdminDrawer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
  projectToEdit?: any;
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit, isLoading, projectToEdit }: Props) {
  const {
    register,
    handleSubmit,
    errors,
    imageUrl,
    setImageUrl,
    dynamicCategories,
    handleFormSubmit,
  } = useProjectFormModal({ isOpen, projectToEdit, onSubmit, isLoading });

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      description={
        projectToEdit 
          ? 'Modifica los detalles y planos del diseño arquitectónico.' 
          : 'Ingresa los detalles y planos del diseño arquitectónico.'
      }
      footer={
        <div className="flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-sans"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoading}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 text-sm font-sans"
          >
            <Save className="w-4 h-4" />
            <span>
              {isLoading ? 'Guardando...' : projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
            </span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2 font-sans">Planos / Foto Principal</h3>
          <CloudinaryUploader 
            currentImage={imageUrl}
            onUpload={(url: string) => setImageUrl(url)}
            onRemove={() => setImageUrl(null)}
            label="Portada del Proyecto"
          />
        </div>

        {/* Basic Info */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2 font-sans">Información Básica</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Nombre del Proyecto</label>
              <input 
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-zinc-650 focus:border-zinc-650 outline-none text-sm font-sans"
                placeholder="Ej. Casa Vistamar"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1 block font-sans">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Categoría</label>
              <select 
                {...register('category', { required: 'La categoría es obligatoria' })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-zinc-650 outline-none text-sm font-sans appearance-none cursor-pointer capitalize"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  backgroundRepeat: 'no-repeat',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" disabled className="text-zinc-600 bg-zinc-950">Selecciona una categoría...</option>
                {dynamicCategories.map((cat, idx) => (
                  <option key={idx} value={cat.toLowerCase()} className="text-white bg-zinc-950 capitalize">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="text-red-400 text-xs mt-1 block font-sans">{errors.category.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Precio Estimado (USD)</label>
              <input 
                type="number"
                {...register('price', { required: 'Precio es obligatorio', valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-zinc-650 outline-none text-sm font-sans"
                placeholder="Ej. 150000"
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2 font-sans">Características (Planos)</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Pisos</label>
              <input 
                type="number"
                {...register('floors', { valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none text-sm font-sans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Área (m²)</label>
              <input 
                type="number"
                {...register('area', { valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none text-sm font-sans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Estilo</label>
              <input 
                {...register('style')}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none text-sm font-sans"
                placeholder="Ej. Minimalista..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Habitaciones</label>
              <input 
                type="number"
                {...register('rooms', { valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none text-sm font-sans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Baños</label>
              <input 
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none text-sm font-sans"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1 font-sans">Descripción del Proyecto</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none resize-none text-sm font-sans"
              placeholder="Describe la visión arquitectónica..."
            />
          </div>
        </div>

      </form>
    </AdminDrawer>
  );
}
