import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export type PageContent = {
  id: string;
  page: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'richtext';
};

export const AVAILABLE_PAGES = ['global', 'home', 'nosotros', 'casas-ya-hechas', 'promociones', 'construccion'];

export const useCMSPage = () => {
  const queryClient = useQueryClient();
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

  // Query contents using React Query
  const { data: contents = [], isLoading } = useQuery<PageContent[]>({
    queryKey: ['admin-cms', selectedPage],
    queryFn: async () => {
      const res = await fetch(`/api/cms?page=${selectedPage}`);
      const json = await res.json();
      if (!res.ok) throw new Error('CMS load failed');
      return json.data || [];
    },
  });

  // Mutations
  const { mutate: updateCMS } = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar elemento.');
      }
      return { id, value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cms', selectedPage] });
      queryClient.invalidateQueries({ queryKey: ['cms', selectedPage] });
      toast.success('¡Cambios guardados con éxito! 💾');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al guardar los cambios.');
      setAlertModal({
        isOpen: true,
        title: 'Error de Guardado',
        message: err.message || 'Ocurrió un error inesperado en el servidor al intentar guardar los cambios.',
      });
    },
    onSettled: () => {
      setIsSaving(null);
    }
  });

  const { mutate: createCMS } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear elemento.');
      }
      return data;
    },
    onSuccess: () => {
      setIsAddingNew(false);
      setNewContent({ page: selectedPage, section: 'hero', type: 'text', key: '', value: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-cms', selectedPage] });
      queryClient.invalidateQueries({ queryKey: ['cms', selectedPage] });
      toast.success('¡Elemento del CMS creado con éxito! ✨');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al crear el nuevo elemento.');
    }
  });

  const { mutate: deleteCMS } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar elemento.');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cms', selectedPage] });
      queryClient.invalidateQueries({ queryKey: ['cms', selectedPage] });
      toast.success('Elemento eliminado correctamente. 🗑️');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al eliminar el elemento.');
      setAlertModal({
        isOpen: true,
        title: 'Error de Eliminación',
        message: err.message || 'Ocurrió un error inesperado en el servidor al intentar eliminar el elemento.',
      });
    }
  });

  const handleUpdate = async (id: string, value: string) => {
    setIsSaving(id);
    updateCMS({ id, value });
  };

  const handleSaveChanges = async () => {
    if (!editModal.item) return;
    const { id, value } = editModal.item;
    setIsSaving(id);
    updateCMS({ id, value });
    setEditModal({ isOpen: false, item: null, originalValue: '' });
  };

  const handleCreateNew = async () => {
    createCMS();
  };

  const handleDelete = (id: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      title: '¿Eliminar elemento del CMS?',
      message: '¿Estás completamente seguro de que deseas eliminar permanentemente este elemento de la base de datos? Esta acción es irreversible.',
      isDanger: true,
      onConfirm: () => {
        deleteCMS(id);
      }
    });
  };

  return {
    contents,
    isLoading,
    selectedPage,
    setSelectedPage,
    isSaving,
    isAddingNew,
    setIsAddingNew,
    newContent,
    setNewContent,
    deleteModal,
    setDeleteModal,
    alertModal,
    setAlertModal,
    editModal,
    setEditModal,
    handleUpdate,
    handleSaveChanges,
    handleCreateNew,
    handleDelete,
  };
};
