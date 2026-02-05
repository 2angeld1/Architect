'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Building2, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { mockProjects } from '../../mocks/projects';
import { useProjects } from '../../hooks/useProjects';
import type { ProjectCategory } from '../../types';
import Reveal from '../../components/ui/Reveal';
import { slideUp, fadeIn } from '../../animations/variants';
import ProjectCard from '../../components/ui/ProjectCard';
import { allCategories } from '../../mocks/categories';

const filterCategories: { value: ProjectCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todos', icon: Grid3X3 },
  ...allCategories.map(c => ({
    value: c.name.toLowerCase() as ProjectCategory,
    label: c.name,
    icon: c.icon as React.ElementType
  }))
];

const ProjectsPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showFilters,
    setShowFilters,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    favorites,
    projectImages,
    filteredProjects,
    toggleFavorite,
  } = useProjects();

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Header */}
      <div className="bg-secondary-900 text-white pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variants={fadeIn}>
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Proyectos Arquitectónicos
              </h1>
              <p className="text-secondary-300 text-lg">
                Explora nuestra colección de más de {mockProjects.length} planos premium.
                Diseños profesionales listos para construir tu hogar ideal.
              </p>
            </div>
          </Reveal>

          {/* Search Bar */}
          <Reveal variants={slideUp} delay={0.2}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, estilo o características..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-secondary-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-700 mb-3 text-sm uppercase tracking-wide">Categoría</h4>
                <div className="space-y-2">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${selectedCategory === cat.value
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-secondary-50 text-secondary-600'
                        }`}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-700 mb-3 text-sm uppercase tracking-wide">Precio</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 hover:bg-secondary-50 rounded-xl text-left text-secondary-600 transition-colors">
                    Hasta $2,000 USD
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-secondary-50 rounded-xl text-left text-secondary-600 transition-colors">
                    $2,000 - $4,000 USD
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-secondary-50 rounded-xl text-left text-secondary-600 transition-colors">
                    Más de $4,000 USD
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <Reveal variants={slideUp} delay={0.4}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="text-secondary-600">
                  <span className="font-bold text-secondary-900">{filteredProjects.length}</span> proyectos encontrados
                </p>
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="appearance-none bg-white border border-secondary-200 rounded-lg px-4 py-2.5 pr-10 text-secondary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      <option value="newest">Más recientes</option>
                      <option value="price-asc">Precio: menor a mayor</option>
                      <option value="price-desc">Precio: mayor a menor</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center bg-secondary-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500'}`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Grid/List */}
            {filteredProjects.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredProjects.map((project, idx) => (
                  <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
                    <ProjectCard
                      project={project}
                      viewMode={viewMode}
                      isFavorite={favorites.includes(project.id)}
                      onToggleFavorite={(id) => toggleFavorite(id)}
                      imageUrl={projectImages[project.id]}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-secondary-100">
                  <Building2 className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-secondary-800 mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="text-secondary-500">
                  Intenta con otros filtros o términos de búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
