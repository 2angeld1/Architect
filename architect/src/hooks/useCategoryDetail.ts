import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { allCategories } from '../mocks/categories';
import { mockProjects } from '../mocks/projects';
import { searchPhotos } from '../services/unsplash';

export const useCategoryDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const [category, setCategory] = useState(allCategories.find(c => c.id === Number(id)));
  const [categoryImages, setCategoryImages] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);

  useEffect(() => {
    const found = allCategories.find(c => c.id === Number(id));
    if (found) {
      setCategory(found);
      const projects = mockProjects.filter(p => 
        p.category.toLowerCase().includes(found.name.toLowerCase()) || 
        found.subcategories.some(sub => p.category.toLowerCase().includes(sub.toLowerCase()))
      );
      setFilteredProjects(projects.length > 0 ? projects : mockProjects.slice(0, 3));

      searchPhotos(found.query, 5).then(photos => {
        if (photos.length > 0) {
          setCategoryImages(photos.map(p => p.urls.regular));
        }
      });
    }
  }, [id]);

  return {
    category,
    categoryImages,
    filteredProjects,
    id
  };
};
