'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import CategoryCard from '../ui/CategoryCard';

const Categories = () => {
    const { categories, isLoading } = useCategories();

  if (isLoading || categories.length === 0) return null;

  return (
    <section id="categorias" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
              <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
              Explora por estilo
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-secondary-900">
              Categorías Populares
            </h2>
          </div>
          <Link
                      href="/categorias"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full font-medium transition-colors group"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5 auto-rows-[180px] lg:auto-rows-[200px]">
                  {categories.slice(0, 5).map((category, index) => (
                      <CategoryCard
                          key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image}
                  count={category.count}
                  icon={category.icon}
                  color={category.color}
                  variant="bento"
                  isLarge={index === 0}
                  isMedium={index === 1 || index === 2}
              />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
