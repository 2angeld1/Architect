'use client';

import { Grid3X3 } from 'lucide-react';
import { useCategoriesPage } from '../../hooks/useCategoriesPage';
import Reveal from '../../components/ui/Reveal';
import { slideUp, fadeIn } from '../../animations/variants';
import CategoryCard from '../../components/ui/CategoryCard';

const CategoriesPage = () => {
    const { categories, isLoading, totalProjects } = useCategoriesPage();

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
          <div className="bg-secondary-900 text-white pt-36 pb-16">
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
                    <CategoryCard
                        id={category.id}
                        name={category.name}
                        image={category.image}
                        count={category.count}
                        icon={category.icon}
                        description={category.description}
                        subcategories={category.subcategories}
                        variant="grid"
                    />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
