import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface MenuLink {
  name: string;
  path: string;
  isHighlight?: boolean;
}

export const useMenusPage = () => {
  const queryClient = useQueryClient();
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

  const { isLoading: loading } = useQuery({
    queryKey: ['admin-menus'],
    queryFn: async () => {
      const response = await fetch('/api/admin/menus');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar los menús de navegación');
      
      setPrimaryLinks(data.menuPrimary || []);
      setSecondaryLinks(data.menuSecondary || []);
      return data;
    },
  });

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

  const { mutate: saveChanges, isPending: saving } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      const response = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryLinks, secondaryLinks }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar los menús de navegación.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Menús de navegación actualizados y guardados con éxito!');
      setTimeout(() => setSuccess(''), 5000);
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
    },
    onError: (err: any) => {
      setError(err.message || 'Error al guardar los cambios.');
    }
  });

  const handleSaveChanges = () => {
    saveChanges();
  };

  return {
    loading,
    saving,
    error,
    setError,
    success,
    setSuccess,
    primaryLinks,
    secondaryLinks,
    newPrimaryName,
    setNewPrimaryName,
    newPrimaryPath,
    setNewPrimaryPath,
    newSecondaryName,
    setNewSecondaryName,
    newSecondaryPath,
    setNewSecondaryPath,
    newSecondaryHighlight,
    setNewSecondaryHighlight,
    handleAddPrimary,
    handleDeletePrimary,
    movePrimaryUp,
    movePrimaryDown,
    handleAddSecondary,
    handleDeleteSecondary,
    moveSecondaryUp,
    moveSecondaryDown,
    handleSaveChanges,
  };
};
