'use client';

import { FolderOpen, Loader2, Check, AlertCircle, Plus, Trash2, Edit3, Send, Layers, X } from 'lucide-react';
import { getCategoryIcon, AVAILABLE_ICONS } from '@/lib/iconHelper';
import { useCategoriesPage } from '@/hooks/admin/useCategoriesPage';
import AdminDrawer from '@/components/admin/shared/AdminDrawer';

export default function CategoriesPage() {
  const { loading, saving, error, success, categoriesList, isModalOpen, editingCategoryId, categoryName, setCategoryName, categoryDescription, setCategoryDescription, categoryIcon, setCategoryIcon, categoryQuery, setCategoryQuery, categorySubcategories, newSubcategoryText, setNewSubcategoryText, handleOpenNewModal, handleOpenEditModal, handleModalClose, handleFormSubmit, handleDeleteCategory, handleAddSubcategory, handleRemoveSubcategory, handleSaveChanges } = useCategoriesPage();

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
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-100 transition-all duration-200 active:scale-[0.98]"
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
            <p className="text-xs text-zinc-600 max-w-sm">Haz clic en "Nueva Categoría" en el header para añadir tus secciones al catálogo.</p>
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

                    <span className="text-[9px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800 truncate max-w-[140px]" title={`Query Unsplash: ${cat.query}`}>
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
                      <span key={i} className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full font-light">
                        {sub}
                      </span>
                    ))}
                    {(!cat.subcategories || cat.subcategories.length === 0) && (
                      <span className="text-[9px] text-zinc-600 italic">Sin etiquetas</span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(cat)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
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

      {/* PREMIUM SHARED ADMIN DRAWER MODAL */}
      <AdminDrawer
        isOpen={isModalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        title={
          <>
            <Layers className="w-5 h-5 text-zinc-400" />
            {editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'}
          </>
        }
        description={editingCategoryId ? 'Modifica los valores de la categoría seleccionada.' : 'Completa los campos para añadir una nueva categoría.'}
        footer={
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={handleModalClose}
              className="flex-1 bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="category-form"
              className="flex-1 bg-white text-zinc-955 hover:bg-zinc-100 text-xs font-semibold py-2.5 rounded-xl transition-all duration-150 text-center active:scale-[0.98]"
            >
              {editingCategoryId ? 'Guardar Cambios' : 'Añadir a la Lista'}
            </button>
          </div>
        }
      >
        <form id="category-form" onSubmit={handleFormSubmit} className="space-y-6">

          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Nombre de Categoría</label>
            <input
              type="text"
              placeholder="ej. Casas Modernas"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
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
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none font-light leading-relaxed"
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
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 font-mono text-[10px]"
            />
            <span className="block text-[9px] text-zinc-500 font-light leading-normal">
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
                    className={`p-2.5 rounded-xl flex items-center justify-center border transition-all ${categoryIcon === iconName
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
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-xl text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
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
                  className="inline-flex items-center gap-1.5 text-[9px] bg-zinc-900 text-zinc-300 border border-zinc-800 pl-2.5 pr-1.5 py-0.5 rounded-full"
                >
                  <span>{sub}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(sub)}
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}

              {categorySubcategories.length === 0 && (
                <span className="text-[10px] text-zinc-650 italic px-2 py-0.5 leading-none">Ninguna etiqueta agregada</span>
              )}
            </div>
          </div>

        </form>
      </AdminDrawer>

    </div>
  );
}
