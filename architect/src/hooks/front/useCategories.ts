import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { searchPhotos } from '../../services/unsplash';
import { Category } from '../../types';
import { getCategoryIcon } from '../../lib/iconHelper';

// Fallback hardcoded categories in case DB is not populated yet
const defaultCategories = [
  {
    id: 1,
    name: 'Casas Modernas',
    description: 'Diseños contemporáneos con líneas limpias y espacios abiertos',
    count: 125,
    iconName: 'Home',
    query: 'modern house architecture exterior',
    subcategories: ['Minimalista', 'Industrial', 'Contemporáneo', 'High-Tech'],
  },
  {
    id: 2,
    name: 'Minimalistas',
    description: 'Espacios funcionales donde menos es más',
    count: 89,
    iconName: 'Minimize2',
    query: 'minimalist house design white',
    subcategories: ['Japonés', 'Escandinavo', 'Zen', 'Blanco total'],
  },
  {
    id: 3,
    name: 'Con Jardín',
    description: 'Diseños que integran la naturaleza en tu hogar',
    count: 156,
    iconName: 'TreePine',
    query: 'house garden backyard',
    subcategories: ['Patio central', 'Jardín posterior', 'Terraza verde', 'Huerto'],
  },
  {
    id: 4,
    name: 'Dos Pisos',
    description: 'Maximiza el espacio vertical con elegancia',
    count: 203,
    iconName: 'Layers',
    query: 'two story modern house',
    subcategories: ['Colonial', 'Mediterráneo', 'Tudor', 'Moderno'],
  },
  {
    id: 5,
    name: 'Departamentos',
    description: 'Soluciones inteligentes para espacios urbanos',
    count: 67,
    iconName: 'Building2',
    query: 'modern apartment building',
    subcategories: ['Loft', 'Penthouse', 'Dúplex', 'Estudio'],
  },
  {
    id: 6,
    name: 'Con Garaje',
    description: 'Diseños que incluyen espacio para tus vehículos',
    count: 145,
    iconName: 'Car',
    query: 'house with garage modern',
    subcategories: ['1 Auto', '2 Autos', '3+ Autos', 'Taller'],
  },
];

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Fetch admin categories using React Query
  const { data: rawCategories = defaultCategories } = useQuery<any[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (json.success && Array.isArray(json.categoriesList) && json.categoriesList.length > 0) {
        return json.categoriesList;
      }
      return defaultCategories;
    },
  });

  // Fetch projects (shared cache!)
  const { data: allProjects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (!json.success) throw new Error('Failed to load projects');
      return json.data || [];
    },
  });

  // Combine categories, dynamic count & Unsplash images
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['processed-categories', rawCategories.map(c => c.name).join(','), allProjects.length],
    queryFn: async () => {
      const updated = await Promise.all(
        rawCategories.map(async (category: any) => {
          const photos = await searchPhotos(category.query || category.name, 1);
          
          const realCount = allProjects.filter(
            (p: any) => p.category?.toLowerCase() === category.name.toLowerCase()
          ).length;

          return {
            ...category,
            count: realCount,
            icon: getCategoryIcon(category.iconName || 'Home'),
            image: photos.length > 0 
              ? `${photos[0].urls.raw}&w=800&q=85&fit=crop` 
              : '',
          };
        })
      );
      return updated as Category[];
    },
    enabled: rawCategories.length > 0,
  });

  // Real-time EventSource listener
  useEffect(() => {
    const eventSource = new EventSource('/api/cms/events?page=global');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          console.log('[Realtime Categories] Updating categories list in real-time...');
          queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
      } catch (err) {
        console.error('Failed to parse SSE data for categories', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return {
    categories,
    isLoading,
  };
};
