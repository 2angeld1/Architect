'use client';

import { useState, useEffect } from 'react';
import { 
  Compass, 
  Loader2, 
  Check, 
  AlertCircle,
  Plus,
  Trash2,
  Send,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Info
} from 'lucide-react';

interface MenuLink {
  name: string;
  path: string;
  isHighlight?: boolean;
}

export default function MenusPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de enlaces primarios y secundarios
  const [primaryLinks, setPrimaryLinks] = useState<MenuLink[]>([]);
  const [secondaryLinks, setSecondaryLinks] = useState<MenuLink[]>([]);

  // Inputs para agregar enlaces
  const [newPrimaryName, setNewPrimaryName] = useState('');
  const [newPrimaryPath, setNewPrimaryPath] = useState('');
  
  const [newSecondaryName, setNewSecondaryName] = useState('');
  const [newSecondaryPath, setNewSecondaryPath] = useState('');
  const [newSecondaryHighlight, setNewSecondaryHighlight] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/admin/menus');
      const data = await response.json();
      if (response.ok) {
        setPrimaryLinks(data.menuPrimary || []);
        setSecondaryLinks(data.menuSecondary || []);
      } else {
        setError(data.error || 'Error al cargar los menús de navegación');
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
      setError('Error de red al cargar menús');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para menú primario
  const handleAddPrimary = () => {
    if (!newPrimaryName.trim() || !newPrimaryPath.trim()) return;
    setPrimaryLinks([...primaryLinks, { name: newPrimaryName.trim(), path: newPrimaryPath.trim() }]);
    setNewPrimaryName('');
    setNewPrimaryPath('');
  };

  const handleDeletePrimary = (index: number) => {
    setPrimaryLinks(primaryLinks.filter((_, i) => i !== index));
  };

  const movePrimaryUp = (index: number) => {
    if (index === 0) return;
    const updated = [...primaryLinks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setPrimaryLinks(updated);
  };

  const movePrimaryDown = (index: number) => {
    if (index === primaryLinks.length - 1) return;
    const updated = [...primaryLinks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setPrimaryLinks(updated);
  };

  // Handlers para menú secundario
  const handleAddSecondary = () => {
    if (!newSecondaryName.trim() || !newSecondaryPath.trim()) return;
    setSecondaryLinks([
      ...secondaryLinks, 
      { 
        name: newSecondaryName.trim(), 
        path: newSecondaryPath.trim(), 
        isHighlight: newSecondaryHighlight 
      }
    ]);
    setNewSecondaryName('');
    setNewSecondaryPath('');
    setNewSecondaryHighlight(false);
  };

  const handleDeleteSecondary = (index: number) => {
    setSecondaryLinks(secondaryLinks.filter((_, i) => i !== index));
  };

  const moveSecondaryUp = (index: number) => {
    if (index === 0) return;
    const updated = [...secondaryLinks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSecondaryLinks(updated);
  };

  const moveSecondaryDown = (index: number) => {
    if (index === secondaryLinks.length - 1) return;
    const updated = [...secondaryLinks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSecondaryLinks(updated);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryLinks, secondaryLinks }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar los menús de navegación.');
      }

      setSuccess('¡Menús de navegación actualizados y guardados con éxito!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">Cargando Menús de Navegación...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      
      {/* Header with action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-light tracking-tight">Menús de Navegación</h1>
          </div>
          <p className="text-xs text-zinc-500 font-light">Diseña y reordena la estructura de navegación de la fila superior y la barra de catálogo de tu sitio web.</p>
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

      {/* Information Alert */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex gap-3 text-zinc-400 text-xs font-light leading-relaxed">
        <Info className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-zinc-300 block">Sugerencia de Arquitectura</span>
          <span>
            Para que la web cargue instantáneamente y no pierda optimización SEO, los enlaces se renderizan de manera estática del lado del servidor (SSR) y se actualizan en el navegador mediante Server-Sent Events (SSE). Los enlaces internos deben empezar con una barra diagonal (ej. <code className="text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded font-mono">/proyectos</code>), mientras que los enlaces externos deben incluir el protocolo completo (ej. <code className="text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded font-mono">https://ejemplo.com</code>).
          </span>
        </div>
      </div>

      {/* Grid containing two menus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Primary Menu */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h3 className="text-base font-semibold text-zinc-200">Fila Superior (Menú Primario)</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Son los enlaces que aparecen en la cabecera principal al lado del logotipo (ej. Inicio, Nosotros, Proyectos).</p>
          </div>

          {/* Active Links list */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {primaryLinks.map((link, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-3 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
              >
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{link.name}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-850">
                      {link.path}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Up / Down Reordering buttons */}
                  <button
                    type="button"
                    onClick={() => movePrimaryUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePrimaryDown(idx)}
                    disabled={idx === primaryLinks.length - 1}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePrimary(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {primaryLinks.length === 0 && (
              <p className="text-xs text-zinc-650 font-light italic text-center py-6">No hay enlaces agregados en el menú primario.</p>
            )}
          </div>

          {/* Builder Form */}
          <div className="p-4 bg-zinc-900/10 border border-zinc-900/60 rounded-xl space-y-4 pt-5">
            <div className="text-xs font-semibold text-zinc-300 border-b border-zinc-900 pb-1.5">Agregar Nuevo Enlace Primario</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Nombre Visible</label>
                <input
                  type="text"
                  placeholder="ej. Nosotros"
                  value={newPrimaryName}
                  onChange={(e) => setNewPrimaryName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Ruta o URL</label>
                <input
                  type="text"
                  placeholder="ej. /nosotros"
                  value={newPrimaryPath}
                  onChange={(e) => setNewPrimaryPath(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800 font-mono"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddPrimary}
              disabled={!newPrimaryName || !newPrimaryPath}
              className="w-full py-2.5 px-3 bg-white text-zinc-950 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir al Menú</span>
            </button>
          </div>
        </div>

        {/* Right Column: Secondary Menu */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h3 className="text-base font-semibold text-zinc-200">Fila Inferior (Barra de Catálogo)</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Enlaces de acceso directo del catálogo que aparecen debajo del menú principal (ej. Garajes, Casas, Departamentos).</p>
          </div>

          {/* Active Links list */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {secondaryLinks.map((link, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-3 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
              >
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{link.name}</span>
                    {link.isHighlight && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[8px] font-bold uppercase tracking-wider">
                        Destacado
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono block text-zinc-500">
                    {link.path}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Up / Down Reordering buttons */}
                  <button
                    type="button"
                    onClick={() => moveSecondaryUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSecondaryDown(idx)}
                    disabled={idx === secondaryLinks.length - 1}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSecondary(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {secondaryLinks.length === 0 && (
              <p className="text-xs text-zinc-650 font-light italic text-center py-6">No hay enlaces agregados en la barra de catálogo.</p>
            )}
          </div>

          {/* Builder Form */}
          <div className="p-4 bg-zinc-900/10 border border-zinc-900/60 rounded-xl space-y-4 pt-5">
            <div className="text-xs font-semibold text-zinc-300 border-b border-zinc-900 pb-1.5">Agregar Nuevo Acceso al Catálogo</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Nombre Visible</label>
                <input
                  type="text"
                  placeholder="ej. Casas Modernas"
                  value={newSecondaryName}
                  onChange={(e) => setNewSecondaryName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Ruta o URL</label>
                <input
                  type="text"
                  placeholder="ej. /proyectos"
                  value={newSecondaryPath}
                  onChange={(e) => setNewSecondaryPath(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/30 border border-zinc-900/60 p-2.5 rounded-lg">
              <input
                type="checkbox"
                id="highlight"
                checked={newSecondaryHighlight}
                onChange={(e) => setNewSecondaryHighlight(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-white focus:ring-zinc-700 focus:ring-offset-0 focus:ring-1 cursor-pointer"
              />
              <label htmlFor="highlight" className="text-[11px] text-zinc-400 cursor-pointer select-none">
                Destacar enlace (Estilo llamativo color rosa en la web principal)
              </label>
            </div>

            <button
              type="button"
              onClick={handleAddSecondary}
              disabled={!newSecondaryName || !newSecondaryPath}
              className="w-full py-2.5 px-3 bg-white text-zinc-950 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir al Catálogo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
