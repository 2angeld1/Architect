'use client';

import { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Loader2, 
  Check, 
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Send,
  HelpCircle,
  Layers,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon, AVAILABLE_ICONS } from '@/lib/iconHelper';

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Categorías Dinámicas
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  // Estado del Modal Deslizante
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | string | null>(null);
  
  // Estados para el Formulario
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Home');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [categorySubcategories, setCategorySubcategories] = useState<string[]>([]);
  const [newSubcategoryText, setNewSubcategoryText] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (response.ok) {
        setCategoriesList(data.categoriesList || []);
      } else {
        setError(data.error || 'Error al cargar categorías');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error de red al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    resetCategoryForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || '');
    setCategoryIcon(cat.iconName || 'Home');
    setCategoryQuery(cat.query || '');
    setCategorySubcategories(cat.subcategories || []);
    setError('');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    resetCategoryForm();
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    // Verificar nombres duplicados
    if (categoriesList.some(c => c.name.toLowerCase() === categoryName.trim().toLowerCase() && c.id !== editingCategoryId)) {
      setError('Ya existe una categoría con este nombre');
      return;
    }

    if (editingCategoryId) {
      // Editar existente
      setCategoriesList(categoriesList.map(cat => 
        cat.id === editingCategoryId
          ? {
              ...cat,
              name: categoryName.trim(),
              description: categoryDescription.trim(),
              iconName: categoryIcon,
              query: categoryQuery.trim() || categoryName.trim(),
              subcategories: categorySubcategories
            }
          : cat
      ));
    } else {
      // Crear nueva
      const newCat = {
        id: Date.now(),
        name: categoryName.trim(),
        description: categoryDescription.trim(),
        count: 0,
        iconName: categoryIcon,
        query: categoryQuery.trim() || categoryName.trim(),
        subcategories: categorySubcategories,
      };
      setCategoriesList([...categoriesList, newCat]);
    }

    handleModalClose();
  };

  const handleDeleteCategory = (id: any) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategoriesList(categoriesList.filter(cat => cat.id !== id));
      setError('');
      setSuccess('Categoría removida de la lista local. Guarda cambios para confirmar.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryText.trim()) return;
    if (categorySubcategories.includes(newSubcategoryText.trim())) return;
    setCategorySubcategories([...categorySubcategories, newSubcategoryText.trim()]);
    setNewSubcategoryText('');
  };

  const handleRemoveSubcategory = (sub: string) => {
    setCategorySubcategories(categorySubcategories.filter(s => s !== sub));
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setCategoryIcon('Home');
    setCategoryQuery('');
    setCategorySubcategories([]);
    setNewSubcategoryText('');
    setError('');
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoriesList }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar las categorías.');
      }

      setSuccess('¡Categorías dinámicas guardadas y actualizadas con éxito!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">Cargando Gestor de Categorías...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans text-zinc-300">
      
      {/* Header Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <FolderOpen className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-light tracking-tight">Categorías del Catálogo</h1>
          </div>
          <p className="text-xs text-zinc-500 font-light">Crea, edita y diseña subcategorías y portadas dinámicas para tus proyectos arquitectónicos en tiempo real.</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Create Category Button */}
          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-355 transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex justify-center items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-zinc-950" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Full-width Grid list of categories */}
      {categoriesList.length === 0 ? (
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-zinc-200">No hay categorías</h4>
            <p className="text-xs text-zinc-650 max-w-sm">Haz clic en "Nueva Categoría" en el header para añadir tus secciones al catálogo.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat) => {
            const CategoryIcon = getCategoryIcon(cat.iconName);
            return (
              <div 
                key={cat.id} 
                className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 group hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top info and Icon */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-350 shadow-inner shadow-black group-hover:scale-105 transition-transform duration-300">
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-[9px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-850 truncate max-w-[140px]" title={`Query Unsplash: ${cat.query}`}>
                      {cat.query || cat.name}
                    </span>
                  </div>

                  {/* Body description */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white capitalize transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed min-h-[32px]">
                      {cat.description || 'Sin descripción descriptiva registrada.'}
                    </p>
                  </div>

                  {/* Subcategories preview tags */}
                  <div className="flex flex-wrap gap-1 pt-1 min-h-[26px]">
                    {cat.subcategories && cat.subcategories.map((sub: string, i: number) => (
                      <span key={i} className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded-full font-light">
                        {sub}
                      </span>
                    ))}
                    {(!cat.subcategories || cat.subcategories.length === 0) && (
                      <span className="text-[9px] text-zinc-650 italic">Sin etiquetas</span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(cat)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-zinc-400" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold bg-red-950/40 border border-red-900/10 text-red-400 hover:bg-red-900 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Eliminar</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* SLIDING SIDE MODAL PANEL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Sliding Form Drawer */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-900 shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="p-8 space-y-6">
                
                {/* Modal Title bar */}
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-light text-white font-heading">
                      {editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h3>
                    <p className="text-xs text-zinc-500 font-light">
                      {editingCategoryId ? 'Modifica los valores de la categoría seleccionada.' : 'Completa los campos para añadir una nueva categoría.'}
                    </p>
                  </div>
                  <button 
                    onClick={handleModalClose}
                    className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  {/* Category Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Nombre de Categoría</label>
                    <input
                      type="text"
                      placeholder="ej. Casas Modernas"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-905 border border-zinc-850 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-650"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Descripción Corta</label>
                    <textarea
                      rows={3}
                      placeholder="Describe la esencia de esta categoría..."
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-905 border border-zinc-850 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-650 resize-none font-light leading-relaxed"
                    />
                  </div>

                  {/* Unsplash Query */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Buscador Unsplash (Palabra Clave)</label>
                    <input
                      type="text"
                      placeholder="ej. modern villa luxury"
                      value={categoryQuery}
                      onChange={(e) => setCategoryQuery(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-905 border border-zinc-850 rounded-xl text-xs text-zinc-100 placeholder-zinc-750 focus:outline-none focus:ring-1 focus:ring-zinc-650 font-mono text-[10px]"
                    />
                    <span className="block text-[9px] text-zinc-600 font-light leading-normal">
                      Esta palabra clave se usará para buscar imágenes en Unsplash de forma automática para la portada.
                    </span>
                  </div>

                  {/* Icon Selector grid */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Icono Visual</label>
                    <div className="grid grid-cols-5 gap-2 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl max-h-36 overflow-y-auto">
                      {AVAILABLE_ICONS.map((iconName) => {
                        const Icon = getCategoryIcon(iconName);
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setCategoryIcon(iconName)}
                            className={`p-2.5 rounded-xl flex items-center justify-center border transition-all ${
                              categoryIcon === iconName 
                                ? 'bg-white text-zinc-950 border-white shadow-md' 
                                : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-zinc-200 hover:border-zinc-850'
                            }`}
                            title={iconName}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subcategories / Tags builder */}
                  <div className="space-y-2.5">
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Subcategorías (Etiquetas)</label>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ej. Minimalista"
                        value={newSubcategoryText}
                        onChange={(e) => setNewSubcategoryText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubcategory();
                          }
                        }}
                        className="w-full px-3 py-2 bg-zinc-905 border border-zinc-850 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-650"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="bg-white text-zinc-950 hover:bg-zinc-100 px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 bg-zinc-900/30 border border-zinc-900 rounded-xl">
                      {categorySubcategories.map((sub, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center gap-1.5 text-[9px] bg-zinc-900 text-zinc-300 border border-zinc-850 pl-2.5 pr-1.5 py-0.5 rounded-full"
                        >
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcategory(sub)}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold text-[8px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {categorySubcategories.length === 0 && (
                        <span className="text-[10px] text-zinc-600 italic px-2 py-0.5 leading-none">Ninguna etiqueta agregada</span>
                      )}
                    </div>
                  </div>

                  {/* Submit actions */}
                  <div className="flex gap-2 pt-6 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="flex-1 bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-850 hover:border-zinc-800 text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold py-2.5 rounded-xl transition-all duration-150 text-center active:scale-[0.98]"
                    >
                      {editingCategoryId ? 'Guardar Cambios' : 'Añadir a la Lista'}
                    </button>
                  </div>

                </form>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
