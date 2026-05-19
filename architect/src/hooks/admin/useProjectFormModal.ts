import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export type ProjectFormData = {
  name: string;
  category: string;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  floors: number;
  style: string;
  description: string;
  images: string[];
};

interface UseProjectFormModalProps {
  isOpen: boolean;
  projectToEdit?: any;
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
}

const defaultCategories = [
  'Residencial',
  'Apartamento / Loft',
  'Diseño de Interiores',
  'Comercial',
  'Industrial',
  'Institucional',
  'Mixto'
];

export const useProjectFormModal = ({
  isOpen,
  projectToEdit,
  onSubmit,
  isLoading,
}: UseProjectFormModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      category: 'residencial',
      floors: 1,
      images: []
    }
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (projectToEdit) {
      reset({
        name: projectToEdit.name || '',
        category: projectToEdit.category || '',
        price: projectToEdit.price ? Number(projectToEdit.price) : 0,
        area: projectToEdit.area || 0,
        rooms: projectToEdit.rooms || 0,
        bathrooms: projectToEdit.bathrooms || 0,
        floors: projectToEdit.floors || 1,
        style: projectToEdit.style || '',
        description: projectToEdit.description || '',
      });
      if (Array.isArray(projectToEdit.images) && projectToEdit.images.length > 0) {
        setImageUrl(projectToEdit.images[0]);
      } else {
        setImageUrl(null);
      }
    } else {
      reset({
        name: '',
        category: 'residencial',
        price: 0,
        area: 0,
        rooms: 0,
        bathrooms: 0,
        floors: 1,
        style: '',
        description: '',
      });
      setImageUrl(null);
    }
  }, [projectToEdit, reset, isOpen]);

  // Load dynamic categories from the API using React Query
  const { data: dynamicCategories = defaultCategories } = useQuery<string[]>({
    queryKey: ['admin-categories-names'],
    queryFn: async () => {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (res.ok && Array.isArray(json.categoriesList)) {
        const names = json.categoriesList.map((c: any) => c.name);
        return names.length > 0 ? names : defaultCategories;
      }
      return defaultCategories;
    },
    enabled: isOpen,
  });

  const handleFormSubmit = (data: ProjectFormData) => {
    const finalData = {
      ...data,
      images: imageUrl ? [imageUrl] : []
    };
    onSubmit(finalData);
    if (!isLoading) {
      reset();
      setImageUrl(null);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    imageUrl,
    setImageUrl,
    dynamicCategories,
    handleFormSubmit,
  };
};
