import { useState, useEffect } from 'react';
import { Home, Building2, TreePine, Layers, Minimize2, Car } from 'lucide-react';
import { searchPhotos } from '../services/unsplash';

import { Category } from '../types';

const defaultCategories = [
  {
    id: 1,
    name: 'Casas Modernas',
    count: 125,
    color: 'from-sky-500/90 to-indigo-600/90',
    query: 'modern house architecture exterior',
    icon: Home,
  },
  {
    id: 2,
    name: 'Minimalistas',
    count: 89,
    color: 'from-emerald-500/90 to-teal-600/90',
    query: 'minimalist house design white',
    icon: Minimize2,
  },
  {
    id: 3,
    name: 'Con Jardín',
    count: 156,
    color: 'from-amber-500/90 to-orange-600/90',
    query: 'house garden backyard',
    icon: TreePine,
  },
  {
    id: 4,
    name: 'Dos Pisos',
    count: 203,
    color: 'from-rose-500/90 to-pink-600/90',
    query: 'two story modern house',
    icon: Layers,
  },
  {
    id: 5,
    name: 'Departamentos',
    count: 67,
    color: 'from-violet-500/90 to-purple-600/90',
    query: 'modern apartment building',
    icon: Building2,
  },
  {
    id: 6,
    name: 'Con Garaje',
    count: 145,
    color: 'from-cyan-500/90 to-blue-600/90',
    query: 'house with garage modern',
    icon: Car,
  },
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const updatedCategories = await Promise.all(
          defaultCategories.map(async (category) => {
            const photos = await searchPhotos(category.query, 1);
            return {
              ...category,
              image: photos.length > 0 
                ? `${photos[0].urls.raw}&w=800&q=85&fit=crop` 
                : '',
            };
          })
        );
        setCategories(updatedCategories.filter(c => c.image !== '') as Category[]);
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryImages();
  }, []);

  return {
    categories,
    isLoading
  };
};
