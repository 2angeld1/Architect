'use client';

import { useState, useEffect } from 'react';
import { 
  Images, 
  Loader2, 
  Check, 
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  UploadCloud,
  Folder,
  FolderPlus,
  ChevronRight,
  Home,
  FolderInput,
  Plus,
  X,
  Info
} from 'lucide-react';

interface MediaFile {
  url: string;
  name: string;
  folder?: string; // Carpeta a la que pertenece (vacio/undefined = raíz)
  uploadedAt: string;
}

export default function MediaPage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingFolder, setSavingFolder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Datos principales
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  
  // Carpeta activa en la navegación ("" es raíz)
  const [currentFolder, setCurrentFolder] = useState<string>('');
  
  // Control de Modales / Inputs
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Control de menús flotantes para mover archivos
  const [activeMoveIndex, setActiveMoveIndex] = useState<number | null>(null);

  // Feedback para copiado de URL
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    try {
      const response = await fetch('/api/admin/media');
      const data = await response.json();
      if (response.ok) {
        // Soporte retrocompatible: si viene un array plano de fotos
        if (Array.isArray(data.images)) {
          setFiles(data.images);
          setFolders([]);
        } else if (data.images && typeof data.images === 'object') {
          setFiles(data.images.files || []);
          setFolders(data.images.folders || []);
        } else {
          setFiles([]);
          setFolders([]);
        }
      } else {
        setError(data.error || 'Error al cargar la biblioteca de medios');
      }
    } catch (err) {
      console.error('Error fetching media data:', err);
      setError('Error de red al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const saveMediaData = async (updatedFolders: string[], updatedFiles: MediaFile[]) => {
    setError('');
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: {
            folders: updatedFolders,
            files: updatedFiles
          }
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar cambios de la biblioteca');
      }
      
      setFolders(updatedFolders);
      setFiles(updatedFiles);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar base de datos');
    }
  };

  // Crear una nueva carpeta
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFolderName.trim();
    if (!cleanName) return;

    if (folders.some(f => f.toLowerCase() === cleanName.toLowerCase())) {
      setError('Ya existe una carpeta con este nombre');
      return;
    }

    setSavingFolder(true);
    const updatedFolders = [...folders, cleanName];
    await saveMediaData(updatedFolders, files);
    
    setNewFolderName('');
    setIsFolderModalOpen(false);
    setSavingFolder(false);
    setSuccess(`Carpeta "${cleanName}" creada con éxito`);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Eliminar una carpeta
  const handleDeleteFolder = async (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const filesInFolder = files.filter(f => f.folder === folderName);
    
    let confirmMessage = `¿Estás seguro de que deseas eliminar la carpeta "${folderName}"?`;
    if (filesInFolder.length > 0) {
      confirmMessage = `La carpeta "${folderName}" contiene ${filesInFolder.length} archivos. Si la eliminas, todos los archivos serán movidos automáticamente a la carpeta de Inicio (Raíz). ¿Deseas continuar?`;
    }

    if (window.confirm(confirmMessage)) {
      const updatedFolders = folders.filter(f => f !== folderName);
      
      // Mover los archivos a la raíz
      const updatedFiles = files.map(file => {
        if (file.folder === folderName) {
          return { ...file, folder: undefined };
        }
        return file;
      });

      await saveMediaData(updatedFolders, updatedFiles);
      setSuccess(`Carpeta "${folderName}" eliminada.`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Subida de archivos directa
  const handleUploadClick = () => {
    document.getElementById('hidden-file-input')?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Convertir a Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Subir usando nuestra API Cloudinary
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64String }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Fallo en la subida a Cloudinary');

        // Derivar un nombre amigable
        let derivedName = file.name;
        try {
          const nameWithoutExtension = file.name.split('.')[0];
          derivedName = nameWithoutExtension.replace(/_/g, ' ').replace(/-/g, ' ');
        } catch (e) {}

        const newImage: MediaFile = {
          url: data.url,
          name: derivedName,
          folder: currentFolder || undefined,
          uploadedAt: new Date().toISOString(),
        };

        const updatedFiles = [newImage, ...files];
        await saveMediaData(folders, updatedFiles);

        setSuccess(`¡Archivo "${derivedName}" subido correctamente!`);
        setTimeout(() => setSuccess(''), 4000);
      };
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
      e.target.value = ''; // Resetear input
    }
  };

  // Mover archivo a otra carpeta
  const handleMoveFile = async (fileIndex: number, targetFolder: string) => {
    const updatedFiles = [...files];
    
    // Obtener el archivo correspondiente en el array global original
    // Primero filtramos para buscar cuál es el archivo real
    const displayedFiles = files.filter(f => currentFolder === '' ? !f.folder : f.folder === currentFolder);
    const targetFile = displayedFiles[fileIndex];
    
    const globalIndex = files.findIndex(f => f.url === targetFile.url);
    if (globalIndex !== -1) {
      files[globalIndex].folder = targetFolder === 'root' ? undefined : targetFolder;
      await saveMediaData(folders, files);
      setActiveMoveIndex(null);
      setSuccess(`Archivo movido con éxito`);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  // Eliminar un archivo
  const handleDeleteFile = async (fileIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const displayedFiles = files.filter(f => currentFolder === '' ? !f.folder : f.folder === currentFolder);
    const targetFile = displayedFiles[fileIndex];

    if (window.confirm(`¿Deseas eliminar permanentemente "${targetFile.name}" de tu biblioteca?`)) {
      const updatedFiles = files.filter(f => f.url !== targetFile.url);
      await saveMediaData(folders, updatedFiles);
      setSuccess('Imagen eliminada de la biblioteca');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const copyToClipboard = (url: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filtrar archivos e imágenes de la carpeta actual
  const activeFolders = folders;
  const activeFiles = files.filter(file => {
    if (currentFolder === '') {
      return !file.folder;
    }
    return file.folder === currentFolder;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">Cargando biblioteca de medios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans text-zinc-300">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Images className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-light tracking-tight">Galería de Medios</h1>
          </div>
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
            <button 
              onClick={() => setCurrentFolder('')}
              className={`hover:text-zinc-200 flex items-center gap-1 ${currentFolder === '' ? 'text-zinc-400 font-medium' : ''}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio (Raíz)</span>
            </button>
            
            {currentFolder && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-700" />
                <span className="text-zinc-300 font-medium capitalize bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                  {currentFolder}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Circular Progress Loader */}
          {uploading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-850 py-2 px-3 rounded-xl animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Subiendo archivo...</span>
            </div>
          )}

          {/* Create Folder Button */}
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 transition-all duration-200 active:scale-[0.98]"
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span>Crear Carpeta</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <UploadCloud className="w-4 h-4 text-zinc-950" />
            <span>Subir Imagen</span>
          </button>

          {/* Hidden File Input */}
          <input 
            type="file" 
            id="hidden-file-input" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
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

      {/* Main Content Grid */}
      <div className="space-y-6">
        
        {/* Render Folder Cards (Only displayed in Root) */}
        {currentFolder === '' && activeFolders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Carpetas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {activeFolders.map((folderName, idx) => {
                const count = files.filter(f => f.folder === folderName).length;
                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentFolder(folderName)}
                    className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-zinc-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-amber-500 fill-amber-500/10 shrink-0" />
                      <div className="text-xs leading-none">
                        <span className="font-semibold text-zinc-200 block group-hover:text-white capitalize transition-colors">
                          {folderName}
                        </span>
                        <span className="text-[10px] text-zinc-500 block mt-1 font-light">
                          {count} {count === 1 ? 'archivo' : 'archivos'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteFolder(folderName, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-650 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Eliminar carpeta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Render Files (Images) Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {currentFolder === '' ? 'Archivos Sueltos' : `Archivos en "${currentFolder}"`}
            </h3>
            <span className="text-[10px] text-zinc-650 font-mono">
              Mostrando {activeFiles.length} de {files.length} totales
            </span>
          </div>

          {activeFiles.length === 0 ? (
            <div className="border border-zinc-900 bg-zinc-950/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <Folder className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-200">No hay archivos en esta ubicación</h4>
                <p className="text-xs text-zinc-650 max-w-sm">Haz clic en "Subir Imagen" en el header para añadir tus primeros archivos a esta carpeta.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {activeFiles.map((image, idx) => (
                <div 
                  key={idx}
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden group hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between relative"
                >
                  {/* Aspect ratio preview zone */}
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {/* Action buttons overlays on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between">
                      <div className="flex gap-2">
                        <a 
                          href={image.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                          title="Ver original"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Move File action */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveMoveIndex(activeMoveIndex === idx ? null : idx)}
                            className={`p-2 rounded-lg border transition-colors ${activeMoveIndex === idx ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-900/90 text-zinc-300 hover:text-amber-500 border-zinc-800'}`}
                            title="Mover a otra carpeta"
                          >
                            <FolderInput className="w-3.5 h-3.5" />
                          </button>

                          {/* Floating Dropdown to Move Folder */}
                          {activeMoveIndex === idx && (
                            <div className="absolute bottom-10 left-0 w-44 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 shadow-2xl z-30 space-y-1">
                              <span className="block text-[9px] text-zinc-500 uppercase tracking-wider font-semibold p-1.5 border-b border-zinc-900">
                                Mover a:
                              </span>
                              {/* Option: Home/Root */}
                              {currentFolder !== '' && (
                                <button
                                  onClick={() => handleMoveFile(idx, 'root')}
                                  className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-zinc-350 hover:bg-zinc-900 hover:text-white flex items-center gap-1.5"
                                >
                                  <Home className="w-3 h-3 text-zinc-500" />
                                  <span>[Inicio / Raíz]</span>
                                </button>
                              )}
                              {/* Option: Other custom folders */}
                              {folders.filter(f => f !== currentFolder).map((fName, fIdx) => (
                                <button
                                  key={fIdx}
                                  onClick={() => handleMoveFile(idx, fName)}
                                  className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-zinc-350 hover:bg-zinc-900 hover:text-white flex items-center gap-1.5 truncate"
                                >
                                  <Folder className="w-3 h-3 text-amber-500" />
                                  <span className="truncate capitalize">{fName}</span>
                                </button>
                              ))}
                              {folders.filter(f => f !== currentFolder).length === 0 && currentFolder === '' && (
                                <span className="block text-[10px] text-zinc-650 font-light italic p-1.5 text-center">
                                  No hay otras carpetas creadas.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteFile(idx, e)}
                        className="p-2 rounded-lg bg-red-950/80 text-red-400 hover:text-red-300 hover:bg-red-900 border border-red-900/50 transition-colors"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata and Clipboard trigger */}
                  <div className="p-3.5 space-y-3.5 flex-grow flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-zinc-200 block truncate" title={image.name}>
                        {image.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono block">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => copyToClipboard(image.url, idx, e)}
                      className={`
                        w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-semibold transition-all duration-200
                        ${copiedIndex === idx 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300'}
                      `}
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Enlace</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CREATE FOLDER MODAL */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-amber-500" />
                <span>Nueva Carpeta</span>
              </h3>
              <button 
                onClick={() => {
                  setNewFolderName('');
                  setIsFolderModalOpen(false);
                }}
                className="text-zinc-500 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-zinc-400 font-medium">Nombre de la carpeta</label>
                <input
                  type="text"
                  placeholder="ej. Planos, Renders, Logos"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-650"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => {
                    setNewFolderName('');
                    setIsFolderModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingFolder || !newFolderName.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {savingFolder && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Crear</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
