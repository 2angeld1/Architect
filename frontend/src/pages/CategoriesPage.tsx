import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import { searchPhotos } from '../services/unsplash';
import { allCategories } from '../mocks/categories';
import Reveal from '../components/ui/Reveal';
import { slideUp, fadeIn } from '../animations/variants';

interface CategoryWithImage {
  id: number;
  name: string;
  description: string;
  count: number;
  image: string;
  icon: React.ElementType;
  query: string;
  subcategories: string[];
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
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
        // Cast to our interface since we know we're adding the image prop
        setCategories(updatedCategories.filter(c => c.image !== '') as unknown as CategoryWithImage[]);
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryImages();
  }, []);

  const totalProjects = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div className="bg-secondary-900 text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-primary-400 font-medium text-sm uppercase tracking-wider mb-4">
                <Grid3X3 className="w-5 h-5" />
                Explora por estilo
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Categorías de Proyectos
              </h1>
              <p className="text-secondary-300 text-lg">
                Navega por nuestra colección de {totalProjects}+ proyectos organizados por estilo, 
                tamaño y características. Encuentra el diseño perfecto para tu próximo hogar.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <Reveal key={category.id} variants={slideUp} delay={idx * 0.1}>
                <Link
                  to={`/categorias/${category.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-secondary-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 block h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <category.icon className="w-6 h-6 text-primary-600" />
                    </div>

                    {/* Count */}
                    <div className="absolute bottom-4 left-4">
                      <span className="text-white font-bold text-2xl">{category.count}</span>
                      <span className="text-white/80 ml-1">proyectos</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-secondary-500 text-sm mb-4">
                      {category.description}
                    </p>

                    {/* Subcategories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="text-xs text-secondary-400">
                          +{category.subcategories.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-primary-600 font-medium group-hover:underline">
                      <span>Explorar categoría</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
