'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Type, Image as ImageIcon, LayoutTemplate, Trash2, Loader2, Edit3 } from 'lucide-react';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';
import toast from 'react-hot-toast';

type PageContent = {
  id: string;
  page: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'richtext';
};

// Páginas pre-configuradas para guiar al usuario
const AVAILABLE_PAGES = ['global', 'home', 'nosotros', 'casas-ya-hechas', 'promociones'];

export default function CMSPage() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // Nuevo contenido state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newContent, setNewContent] = useState<Partial<PageContent>>({
    page: 'home',
    section: 'hero',
    type: 'text',
    key: '',
    value: ''
  });

  // Modal de confirmación de eliminación state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
    message: string;
    onConfirm: () => void;
    isDanger: boolean;
  }>({
    isOpen: false,
    id: null,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: true,
  });

  // Modal de notificación general (alerta) state
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Modal de edición de elemento state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: PageContent | null;
    originalValue: string;
  }>({
    isOpen: false,
    item: null,
    originalValue: ''
  });

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cms?page=${selectedPage}`);
      const json = await res.json();
      setContents(json.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [selectedPage]);

  const handleUpdate = async (id: string, value: string) => {
    setIsSaving(id);
    try {
      await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value }),
      });
      // Optionally show a toast here
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!editModal.item) return;
    const { id, value } = editModal.item;
    setIsSaving(id);
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value }),
      });
      if (res.ok) {
        // Update local contents list state
        setContents(contents.map(c => c.id === id ? { ...c, value } : c));
        setEditModal({ isOpen: false, item: null, originalValue: '' });
        toast.success('¡Cambios guardados con éxito! 💾');
      } else {
        toast.error('Error al guardar los cambios.');
        setAlertModal({
          isOpen: true,
          title: 'Error de Guardado',
          message: 'Ocurrió un error inesperado en el servidor al intentar guardar los cambios.',
        });
      }
    } catch (error) {
      console.error(error);
      setAlertModal({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'No se pudo establecer conexión con el servidor para guardar los cambios.',
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleCreateNew = async () => {
    try {
      // Usaremos un endpoint POST para crear (necesitamos añadirlo en el backend, por ahora simulo que existe)
      // Como atajo rápido para la demo, haremos un POST al API y luego recargaremos
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
      if(res.ok) {
        setIsAddingNew(false);
        setNewContent({ page: selectedPage, section: 'hero', type: 'text', key: '', value: '' });
        fetchContent();
        toast.success('¡Elemento del CMS creado con éxito! ✨');
      } else {
        toast.error('Error al crear el nuevo elemento.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      title: '¿Eliminar elemento del CMS?',
      message: '¿Estás completamente seguro de que deseas eliminar permanentemente este elemento de la base de datos? Esta acción es irreversible.',
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/cms?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setContents(contents.filter(item => item.id !== id));
            toast.success('Elemento eliminado correctamente. 🗑️');
          } else {
            toast.error('Error al eliminar el elemento.');
            setAlertModal({
              isOpen: true,
              title: 'Error de Eliminación',
              message: 'Ocurrió un error inesperado en el servidor al intentar eliminar el elemento.',
            });
          }
        } catch (error) {
          console.error('Error deleting content:', error);
          setAlertModal({
            isOpen: true,
            title: 'Error de Conexión',
            message: 'No se pudo establecer conexión con el servidor para procesar la eliminación.',
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-white tracking-wide">Gestor de Contenido (CMS)</h2>
          <p className="text-zinc-500 text-sm mt-1">Edita los textos e imágenes principales de tu sitio web sin tocar código.</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <Plus className="w-4 h-4" />
          Añadir Elemento
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {AVAILABLE_PAGES.map((page) => (
          <button
            key={page}
            onClick={() => {
              setSelectedPage(page);
              setNewContent({ ...newContent, page });
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap border ${
              selectedPage === page 
                ? 'bg-zinc-800 text-white border-zinc-700' 
                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {page.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Editor Form for New Element */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-zinc-900/80 border border-indigo-500/30 rounded-2xl p-6"
            >
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-indigo-400"/> Nuevo elemento para la página "{selectedPage}"
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Sección (ej. hero, footer)</label>
                  <input 
                    type="text" 
                    value={newContent.section}
                    onChange={(e) => setNewContent({...newContent, section: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Identificador (ej. title, subtitle)</label>
                  <input 
                    type="text" 
                    value={newContent.key}
                    onChange={(e) => setNewContent({...newContent, key: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Tipo de Contenido</label>
                  <select 
                    value={newContent.type}
                    onChange={(e) => setNewContent({...newContent, type: e.target.value as any})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 outline-none"
                  >
                    <option value="text">Texto Corto</option>
                    <option value="richtext">Párrafo Largo</option>
                    <option value="image">Imagen</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                 <label className="block text-xs text-zinc-400 mb-1">Valor inicial</label>
                 {newContent.type === 'text' ? (
                   <input 
                      type="text" 
                      value={newContent.value}
                      onChange={(e) => setNewContent({...newContent, value: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 outline-none"
                    />
                 ) : newContent.type === 'image' ? (
                   <CloudinaryUploader 
                      currentImage={newContent.value}
                      onUpload={(url) => setNewContent({...newContent, value: url})}
                      onRemove={() => setNewContent({...newContent, value: ''})}
                   />
                 ) : (
                   <textarea 
                      rows={8}
                      value={newContent.value}
                      onChange={(e) => setNewContent({...newContent, value: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 outline-none resize-y min-h-[150px]"
                    />
                 )}
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >Cancelar</button>
                <button 
                  onClick={handleCreateNew}
                  className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                >Guardar Elemento</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Content Blocks - Grid of small cards */}
        {isLoading ? (
          <div className="text-center py-20 text-zinc-500">Cargando contenido...</div>
        ) : contents.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl col-span-full">
            <LayoutTemplate className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">Esta página aún no tiene elementos editables registrados.</p>
            <p className="text-sm text-zinc-600 mt-1">Haz clic en "Añadir Elemento" para empezar a configurar el CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={item.id}
                onClick={() => setEditModal({ isOpen: true, item: { ...item }, originalValue: item.value })}
                className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-700/60 rounded-2xl p-5 flex flex-col justify-between min-h-[170px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Type className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {item.type === 'richtext' ? 'párrafo' : item.type}
                      </span>
                    </div>

                    {/* Trash Button - stop propagation so it doesn't open the edit modal */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-zinc-550 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Eliminar elemento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-white font-medium text-sm capitalize mb-2 group-hover:text-indigo-300 transition-colors truncate">
                    {item.section} <span className="text-zinc-500 font-normal">/</span> {item.key}
                  </h4>

                  {/* Truncated preview value */}
                  <div className="text-xs text-zinc-400 font-light line-clamp-3">
                    {item.type === 'image' ? (
                      item.value ? (
                        <div className="flex items-center gap-2 text-zinc-500 italic mt-1 bg-zinc-950/40 p-1.5 rounded border border-zinc-850">
                          <img src={item.value} alt={item.key} className="w-6 h-6 object-cover rounded-md" />
                          <span className="truncate">{item.value}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-650 italic">Sin imagen configurada</span>
                      )
                    ) : item.value ? (
                      item.value
                    ) : (
                      <span className="text-zinc-650 italic">Vacío</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors pt-2 border-t border-zinc-850/30">
                  <span>Hacer clic para editar</span>
                  <Edit3 className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl overflow-hidden z-10"
            >
              {/* Decorative top border */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${deleteModal.isDanger ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`} />

              <h3 className="text-xl font-light text-zinc-100 mt-2 mb-3 tracking-wide">
                {deleteModal.title}
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                {deleteModal.message}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteModal.onConfirm();
                    setDeleteModal({ ...deleteModal, isOpen: false });
                  }}
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-xl transition-all shadow-md active:scale-95 ${
                    deleteModal.isDanger 
                      ? 'bg-red-600 hover:bg-red-500' 
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Alerta / Notificación */}
      <AnimatePresence>
        {alertModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl overflow-hidden z-10"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />

              <h3 className="text-lg font-light text-zinc-100 mt-2 mb-3 tracking-wide">
                {alertModal.title}
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                {alertModal.message}
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
                  className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Modal de Edición de Elemento */}
      <AnimatePresence>
        {editModal.isOpen && editModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, item: null, originalValue: '' })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 max-w-5xl w-full shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600" />

              {/* Header */}
              <div className="mb-6 flex justify-between items-start mt-2">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    Edición de Contenido
                  </span>
                  <h3 className="text-xl font-light text-zinc-100 mt-2 tracking-wide capitalize">
                    {editModal.item.section} <span className="text-zinc-500 font-normal">/</span> {editModal.item.key}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Página: {editModal.item.page} | Tipo: {editModal.item.type}</p>
                </div>
                <button
                  onClick={() => setEditModal({ isOpen: false, item: null, originalValue: '' })}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                >
                  ✕
                </button>
              </div>

              {/* Content Form Scrollable area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Contenido/Valor</label>
                  
                  {editModal.item.type === 'text' && (
                    <input 
                      type="text" 
                      value={editModal.item.value}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        item: { ...editModal.item!, value: e.target.value }
                      })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none focus:border-zinc-700 transition-colors text-sm"
                    />
                  )}
                  
                  {editModal.item.type === 'richtext' && (
                    <textarea 
                      rows={14}
                      value={editModal.item.value}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        item: { ...editModal.item!, value: e.target.value }
                      })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 outline-none resize-y min-h-[350px] focus:border-zinc-700 transition-colors text-sm"
                    />
                  )}

                  {editModal.item.type === 'image' && (
                    <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl">
                      <CloudinaryUploader 
                        currentImage={editModal.item.value}
                        onUpload={(url) => setEditModal({
                          ...editModal,
                          item: { ...editModal.item!, value: url }
                        })}
                        onRemove={() => setEditModal({
                          ...editModal,
                          item: { ...editModal.item!, value: '' }
                        })}
                        label="Reemplazar Imagen"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-zinc-900 pt-4 mt-auto">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, item: null, originalValue: '' })}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving === editModal.item.id || editModal.item.value === editModal.originalValue}
                  className="flex items-center gap-2 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 disabled:scale-100 disabled:pointer-events-none"
                >
                  {isSaving === editModal.item.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
