import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchPhotos } from '../../services/unsplash';
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
    name: 'Casas Minimalistas',
    description: 'Espacios funcionales donde menos es más',
    count: 89,
    iconName: 'Minimize2',
    query: 'minimalist house design white',
    subcategories: ['Japonés', 'Escandinavo', 'Zen', 'Blanco total'],
  },
  {
    id: 3,
    name: 'Casas con Jardín',
    description: 'Diseños que integran la naturaleza en tu hogar',
    count: 156,
    iconName: 'TreePine',
    query: 'house garden backyard',
    subcategories: ['Patio central', 'Jardín posterior', 'Terraza verde', 'Huerto'],
  },
  {
    id: 4,
    name: 'Casas de Dos Pisos',
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
    name: 'Casas con Garaje',
    description: 'Diseños que incluyen espacio para tus vehículos',
    count: 145,
    iconName: 'Car',
    query: 'house with garage modern',
    subcategories: ['1 Auto', '2 Autos', '3+ Autos', 'Taller'],
  },
  {
    id: 7,
    name: 'Comercial',
    description: 'Espacios diseñados para negocios exitosos',
    count: 45,
    iconName: 'Warehouse',
    query: 'commercial building modern',
    subcategories: ['Oficinas', 'Tiendas', 'Restaurantes', 'Clínicas'],
  },
  {
    id: 8,
    name: 'Casas de Campo',
    description: 'Refugios rústicos para escapar de la ciudad',
    count: 78,
    iconName: 'Castle',
    query: 'country house rustic',
    subcategories: ['Cabaña', 'Hacienda', 'Cottage', 'Granja'],
  },
  {
    id: 9,
    name: 'Casas Pequeñas',
    description: 'Diseños compactos pero completos para terrenos reducidos',
    count: 92,
    iconName: 'Tent',
    query: 'tiny house modern',
    subcategories: ['Micro-casa', 'Sin permiso', 'ADU', 'Container'],
  },
];

export const useCategoryDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();

  // Query global CMS config using React Query (shared cache!)
  const { data: cmsGlobal = {} } = useQuery<Record<string, string>>({
    queryKey: ['cms', 'global'],
    queryFn: async () => {
      const res = await fetch('/api/cms?page=global');
      const json = await res.json();
      if (!json.success) throw new Error('CMS load failed');
      return json.formatted || {};
    },
  });

  // Query projects (shared cache!)
  const { data: allProjects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (!json.success) throw new Error('Failed to load projects');
      return json.data || [];
    },
  });

  const rawCategories = useMemo(() => {
    if (cmsGlobal.categories_list) {
      try {
        return JSON.parse(cmsGlobal.categories_list);
      } catch (e) {
        console.error('Failed to parse categories_list JSON:', e);
      }
    }
    return defaultCategories;
  }, [cmsGlobal]);

  const category = useMemo(() => {
    if (!id) return null;
    const found = rawCategories.find(
      (c: any) => String(c.id) === String(id) || String(c.name).toLowerCase() === String(id).toLowerCase()
    );
    if (!found) return null;
    return {
      ...found,
      icon: getCategoryIcon(found.iconName || 'Home')
    };
  }, [rawCategories, id]);

  const filteredProjects = useMemo(() => {
    if (!category) return [];
    const matched = allProjects.filter((p: any) => 
      p.category.toLowerCase().includes(category.name.toLowerCase()) || 
      (category.subcategories && category.subcategories.some((sub: string) => p.category.toLowerCase().includes(sub.toLowerCase())))
    );
    return matched.length > 0 ? matched : allProjects.slice(0, 3);
  }, [category, allProjects]);

  // Fetch Unsplash photos for background/gallery
  const { data: categoryImages = [], isLoading: loadingImages } = useQuery<string[]>({
    queryKey: ['category-photos', category?.name],
    queryFn: async () => {
      if (!category) return [];
      const photos = await searchPhotos(category.query || category.name, 5);
      return photos.map(p => p.urls.regular);
    },
    enabled: !!category?.name,
  });

  // Listen to real-time events to auto-refresh
  useEffect(() => {
    const eventSource = new EventSource('/api/cms/events?page=global');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          console.log('[Realtime Category Detail] Invaliding caches...');
          queryClient.invalidateQueries({ queryKey: ['cms', 'global'] });
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return {
    category,
    categoryImages,
    filteredProjects,
    id,
    isLoading: loadingImages
  };
};
