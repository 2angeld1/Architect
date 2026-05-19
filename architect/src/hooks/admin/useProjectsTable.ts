import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useProjectsTable = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any | null>(null);

  // Fetch projects from DB using React Query
  const { data: projects = [], isLoading } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (!res.ok) throw new Error('Failed to load projects');
      return json.data || [];
    },
  });

  // Delete project mutation
  const { mutate: deleteProjectMutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Create project mutation
  const { mutateAsync: createProjectMutate } = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Update project mutation
  const { mutateAsync: updateProjectMutate } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleEditClick = (project: any) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (project: any) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"?`)) {
      deleteProjectMutate(project.id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (projectToEdit) {
        await updateProjectMutate({ id: projectToEdit.id, data });
        setIsModalOpen(false);
        setProjectToEdit(null);
      } else {
        await createProjectMutate(data);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error submitting project form:', err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const handleNewProjectClick = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  return {
    projects,
    isLoading,
    isModalOpen,
    projectToEdit,
    handleEditClick,
    handleDeleteClick,
    handleFormSubmit,
    handleModalClose,
    handleNewProjectClick,
  };
};
