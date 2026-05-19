import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

export interface MediaFile {
  url: string;
  name: string;
  folder?: string; // Carpeta a la que pertenece (vacio/undefined = raíz)
  uploadedAt: string;
}

export const useMediaPage = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [savingFolder, setSavingFolder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Carpeta activa en la navegación ("" es raíz)
  const [currentFolder, setCurrentFolder] = useState<string>('');
  
  // Control de Modales / Inputs
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Control de menús flotantes para mover archivos
  const [activeMoveIndex, setActiveMoveIndex] = useState<number | null>(null);

  // Feedback para copiado de URL
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Query media data using React Query
  const { data: mediaData = { folders: [] as string[], files: [] as MediaFile[] }, isLoading: loading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const response = await fetch('/api/admin/media');
      const data = await response.json();
      if (!response.ok) throw new Error('Error al cargar la biblioteca de medios');
      
      let files: MediaFile[] = [];
      let folders: string[] = [];

      if (Array.isArray(data.images)) {
        files = data.images;
      } else if (data.images && typeof data.images === 'object') {
        files = data.images.files || [];
        folders = data.images.folders || [];
      }
      return { folders, files };
    },
  });

  const folders = mediaData.folders;
  const files = mediaData.files;

  // Mutation to save media layout data
  const { mutateAsync: saveMediaData } = useMutation({
    mutationFn: async ({ updatedFolders, updatedFiles }: { updatedFolders: string[]; updatedFiles: MediaFile[] }) => {
      setError('');
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
      return { updatedFolders, updatedFiles };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    },
    onError: (err: any) => {
      setError(err.message || 'Error al actualizar base de datos');
    }
  });

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
    await saveMediaData({ updatedFolders, updatedFiles: files });
    
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

      await saveMediaData({ updatedFolders, updatedFiles });
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
        await saveMediaData({ updatedFolders: folders, updatedFiles });

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
    const displayedFiles = files.filter(f => currentFolder === '' ? !f.folder : f.folder === currentFolder);
    const targetFile = displayedFiles[fileIndex];
    
    const globalIndex = files.findIndex(f => f.url === targetFile.url);
    if (globalIndex !== -1) {
      const updatedFiles = [...files];
      updatedFiles[globalIndex] = {
        ...updatedFiles[globalIndex],
        folder: targetFolder === 'root' ? undefined : targetFolder
      };
      await saveMediaData({ updatedFolders: folders, updatedFiles });
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
      await saveMediaData({ updatedFolders: folders, updatedFiles });
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
  const activeFiles = useMemo(() => {
    return files.filter(file => {
      if (currentFolder === '') {
        return !file.folder;
      }
      return file.folder === currentFolder;
    });
  }, [files, currentFolder]);

  return {
    loading,
    uploading,
    savingFolder,
    error,
    setError,
    success,
    setSuccess,
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
  };
};
