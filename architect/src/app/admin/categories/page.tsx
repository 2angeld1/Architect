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
  ArrowRight
} from 'lucide-react';
import { getCategoryIcon, AVAILABLE_ICONS } from '@/lib/iconHelper';

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Categorías Dinámicas
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  // Inputs para agregar/editar categoría
  const [editingCategoryId, setEditingCategoryId] = useState<number | string | null>(null);
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

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;
    
    // Check if duplicate name
    if (categoriesList.some(c => c.name.toLowerCase() === categoryName.trim().toLowerCase() && c.id !== editingCategoryId)) {
      setError('Ya existe una categoría con este nombre');
      return;
    }

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
    resetCategoryForm();
    setError('');
  };

  const handleStartEdit = (cat: any) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || '');
    setCategoryIcon(cat.iconName || 'Home');
    setCategoryQuery(cat.query || '');
    setCategorySubcategories(cat.subcategories || []);
    setError('');
  };

  const handleSaveEdit = () => {
    if (!editingCategoryId || !categoryName.trim()) return;

    // Check if duplicate name
    if (categoriesList.some(c => c.name.toLowerCase() === categoryName.trim().toLowerCase() && c.id !== editingCategoryId)) {
      setError('Ya existe una categoría con este nombre');
      return;
    }

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
    resetCategoryForm();
    setError('');
  };

  const handleDeleteCategory = (id: any) => {
    setCategoriesList(categoriesList.filter(cat => cat.id !== id));
    setError('');
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">Cargando Gestor de Categorías...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Save action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <FolderOpen className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-light font-heading tracking-tight">Categorías del Catálogo</h1>
          </div>
          <p className="text-xs text-zinc-500 font-light">Crea, edita y diseña subcategorías y portadas dinámicas para tus proyectos arquitectónicos en tiempo real.</p>
        </div>

        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="flex justify-center items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5"
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

      {/* Banners */}
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

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Categories List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-base font-light text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>Categorías Activas ({categoriesList.length})</span>
              </h3>
              <p className="text-[10px] text-zinc-500">Cualquier cambio realizado se aplicará en todo el sitio público al hacer clic en "Guardar Cambios".</p>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {categoriesList.map((cat) => {
                const CategoryIcon = getCategoryIcon(cat.iconName);
                return (
                  <div 
                    key={cat.id} 
                    className={`flex items-start justify-between gap-4 p-4 rounded-2xl transition-all duration-200 border ${
                      editingCategoryId === cat.id 
                        ? 'bg-zinc-900/60 border-zinc-700 shadow-md shadow-black/40' 
                        : 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon box */}
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                        <CategoryIcon className="w-5 h-5 text-zinc-100" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-zinc-200">{cat.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800/80">
                            {cat.query || cat.name}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-light">{cat.description || 'Sin descripción'}</p>
                        
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cat.subcategories.map((sub: string, i: number) => (
                              <span key={i} className="text-[9px] bg-zinc-900/60 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full">
                                {sub}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {categoriesList.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl text-zinc-500">
                  <FolderOpen className="w-8 h-8 text-zinc-600 mb-2" />
                  <p className="text-xs italic">No hay categorías configuradas. Crea una para comenzar.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Form builder */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-5">
            <div className="border-b border-zinc-900 pb-2">
              <h4 className="text-sm font-semibold text-zinc-200">
                {editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'}
              </h4>
              <p className="text-[10px] text-zinc-500">
                {editingCategoryId ? 'Modifica los valores de la categoría seleccionada.' : 'Completa los campos para añadir una nueva categoría.'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Nombre de Categoría</label>
                <input
                  type="text"
                  placeholder="ej. Casas Modernas"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                />
              </div>

              {/* Description field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Descripción Corta</label>
                <textarea
                  rows={2}
                  placeholder="Describe la esencia de esta categoría..."
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800 resize-none"
                />
              </div>

              {/* Unsplash query field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span>Buscador Unsplash (Query)</span>
                </label>
                <input
                  type="text"
                  placeholder="ej. modern villa luxury"
                  value={categoryQuery}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800 font-mono text-[10px]"
                />
                <span className="block text-[9px] text-zinc-600 font-light leading-relaxed">
                  Esta palabra clave se usará para buscar imágenes en Unsplash de forma automática para la portada.
                </span>
              </div>

              {/* Icon selector field */}
              <div className="space-y-2">
                <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Icono Visual</label>
                <div className="grid grid-cols-6 gap-2 p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl max-h-36 overflow-y-auto">
                  {AVAILABLE_ICONS.map((iconName) => {
                    const Icon = getCategoryIcon(iconName);
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setCategoryIcon(iconName)}
                        className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
                          categoryIcon === iconName 
                            ? 'bg-white text-zinc-950 border-white shadow-md' 
                            : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-zinc-200 hover:border-zinc-800'
                        }`}
                        title={iconName}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subcategories tags builder */}
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
                    className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="bg-white text-zinc-950 hover:bg-zinc-100 px-3 rounded-xl text-xs font-semibold shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  {categorySubcategories.map((sub, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-800 pl-2.5 pr-1.5 py-0.5 rounded-full"
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
                    <span className="text-[10px] text-zinc-600 italic px-2 py-0.5 leading-none">Ninguna subcategoría agregada</span>
                  )}
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-2 pt-2 border-t border-zinc-900">
              {editingCategoryId ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex-1 bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="flex-1 bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                >
                  Añadir Categoría
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
