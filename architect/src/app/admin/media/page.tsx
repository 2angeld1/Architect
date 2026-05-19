'use client';

import { 
  Loader2, 
  Check, 
  AlertCircle,
  Folder
} from 'lucide-react';
import { useMediaPage } from '@/hooks/admin/useMediaPage';
import MediaHeader from '@/components/admin/media/MediaHeader';
import FolderCard from '@/components/admin/media/FolderCard';
import MediaCard from '@/components/admin/media/MediaCard';
import FolderModal from '@/components/admin/media/FolderModal';

export default function MediaPage() {
  const {
    loading,
    uploading,
    savingFolder,
    error,
    success,
    folders,
    files,
    currentFolder,
    setCurrentFolder,
    isFolderModalOpen,
    setIsFolderModalOpen,
    newFolderName,
    setNewFolderName,
    activeMoveIndex,
    setActiveMoveIndex,
    copiedIndex,
    handleCreateFolder,
    handleDeleteFolder,
    handleUploadClick,
    handleFileChange,
    handleMoveFile,
    handleDeleteFile,
    copyToClipboard,
    activeFolders,
    activeFiles,
  } = useMediaPage();

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
      
      {/* Dynamic Header Component */}
      <MediaHeader
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        uploading={uploading}
        setIsFolderModalOpen={setIsFolderModalOpen}
        handleUploadClick={handleUploadClick}
        handleFileChange={handleFileChange}
      />

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
                  <FolderCard
                    key={folderName}
                    folderName={folderName}
                    count={count}
                    idx={idx}
                    onClick={() => setCurrentFolder(folderName)}
                    onDelete={(e) => handleDeleteFolder(folderName, e)}
                  />
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
                <p className="text-xs text-zinc-600 max-w-sm">Haz clic en "Subir Imagen" en el header para añadir tus primeros archivos a esta carpeta.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {activeFiles.map((image, idx) => (
                <MediaCard
                  key={image.url}
                  image={image}
                  idx={idx}
                  currentFolder={currentFolder}
                  folders={folders}
                  activeMoveIndex={activeMoveIndex}
                  setActiveMoveIndex={setActiveMoveIndex}
                  copiedIndex={copiedIndex}
                  handleMoveFile={handleMoveFile}
                  handleDeleteFile={handleDeleteFile}
                  copyToClipboard={copyToClipboard}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CREATE FOLDER MODAL */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setNewFolderName('');
          setIsFolderModalOpen(false);
        }}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onSubmit={handleCreateFolder}
        savingFolder={savingFolder}
      />

    </div>
  );
}
