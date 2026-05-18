import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { searchPhotos } from '../services/unsplash';
import { getCategoryIcon } from '../lib/iconHelper';

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
  const [category, setCategory] = useState<any>(null);
  const [categoryImages, setCategoryImages] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryAndProjects = async () => {
      try {
        // Fetch public projects
        const projectsRes = await fetch('/api/projects');
        const projectsJson = await projectsRes.json();
        const allProjects = projectsJson.success ? projectsJson.data : [];

        // Fetch categories list from CMS
        const res = await fetch('/api/cms?page=global');
        const json = await res.json();
        
        let rawCategories = defaultCategories;
        if (json.success && json.formatted && json.formatted.categories_list) {
          try {
            rawCategories = JSON.parse(json.formatted.categories_list);
          } catch (e) {
            console.error('Failed to parse categories_list JSON:', e);
          }
        }

        // Find match by string or number comparison
        const found = rawCategories.find(
          (c: any) => String(c.id) === String(id) || String(c.name).toLowerCase() === String(id).toLowerCase()
        );

        if (found) {
          const mappedCategory = {
            ...found,
            icon: getCategoryIcon(found.iconName || 'Home')
          };
          setCategory(mappedCategory);

          // Filter real dynamic projects instead of mock list!
          const matched = allProjects.filter((p: any) => 
            p.category.toLowerCase().includes(found.name.toLowerCase()) || 
            (found.subcategories && found.subcategories.some((sub: string) => p.category.toLowerCase().includes(sub.toLowerCase())))
          );
          setFilteredProjects(matched.length > 0 ? matched : allProjects.slice(0, 3));

          // Fetch Unsplash photos for background/gallery
          const photos = await searchPhotos(found.query || found.name, 5);
          if (photos.length > 0) {
            setCategoryImages(photos.map(p => p.urls.regular));
          }
        }
      } catch (err) {
        console.error('Error in useCategoryDetail:', err);
      }
    };

    if (id) {
      fetchCategoryAndProjects();
    }
  }, [id]);

  return {
    category,
    categoryImages,
    filteredProjects,
    id
  };
};
