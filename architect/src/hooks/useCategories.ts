import { useState, useEffect } from 'react';
import { searchPhotos } from '../services/unsplash';
import { Category } from '../types';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
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

        const updatedCategories = await Promise.all(
          rawCategories.map(async (category: any) => {
            const photos = await searchPhotos(category.query || category.name, 1);
            return {
              ...category,
              icon: getCategoryIcon(category.iconName || 'Home'),
              image: photos.length > 0 
                ? `${photos[0].urls.raw}&w=800&q=85&fit=crop` 
                : '',
            };
          })
        );
        
        setCategories(updatedCategories as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesData();

    // Listen to real-time events from SSE API
    const eventSource = new EventSource('/api/cms/events?page=global');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          console.log('[Realtime Categories] Updating categories list in real-time...');
          fetchCategoriesData();
        }
      } catch (err) {
        console.error('Failed to parse SSE data for categories', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return {
    categories,
    isLoading
  };
};
