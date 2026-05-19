import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useCategoriesPage = () => {
  const queryClient = useQueryClient();
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

  const { isLoading: loading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar categorías');
      setCategoriesList(data.categoriesList || []);
      return data.categoriesList || [];
    },
  });

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

  const { mutate: saveChanges, isPending: saving } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoriesList }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar las categorías.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Categorías dinámicas guardadas y actualizadas con éxito!');
      setTimeout(() => setSuccess(''), 5000);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories-names'] });
    },
    onError: (err: any) => {
      setError(err.message || 'Error al guardar');
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
    categoriesList,
    isModalOpen,
    editingCategoryId,
    categoryName,
    setCategoryName,
    categoryDescription,
    setCategoryDescription,
    categoryIcon,
    setCategoryIcon,
    categoryQuery,
    setCategoryQuery,
    categorySubcategories,
    newSubcategoryText,
    setNewSubcategoryText,
    handleOpenNewModal,
    handleOpenEditModal,
    handleModalClose,
    handleFormSubmit,
    handleDeleteCategory,
    handleAddSubcategory,
    handleRemoveSubcategory,
    handleSaveChanges,
  };
};
