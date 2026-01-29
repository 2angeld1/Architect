import { useState, useEffect } from 'react';
import { searchPhotos } from '../services/unsplash';
import { allCategories } from '../mocks/categories';

import { Category } from '../types';

export const useCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const updatedCategories = await Promise.all(
          allCategories.map(async (category) => {
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

  const totalProjects = categories.reduce((sum, cat) => sum + cat.count, 0);

  return {
    categories,
    isLoading,
    totalProjects
  };
};
