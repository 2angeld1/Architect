import { ArrowRight, Lightbulb, MapPin, Grid, Info } from 'lucide-react';
import { useCategoryDetail } from '../hooks/useCategoryDetail';
import Reveal from '../components/ui/Reveal';
import { fadeIn, slideUp } from '../animations/variants';
import ProjectCard from '../components/ui/ProjectCard';

const CategoryDetailPage = () => {
    const { category, categoryImages, filteredProjects } = useCategoryDetail();

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-secondary-500">Categoría no encontrada</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px] overflow-hidden bg-secondary-900">
                {categoryImages[0] && (
                    <img
                        src={categoryImages[0]}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/20 to-transparent" />

                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <Reveal variants={fadeIn}>
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 backdrop-blur-md rounded-full text-primary-300 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/30">
                                    <category.icon className="w-4 h-4" />
                                    Categoría de Diseño
                                </span>
                                <h1 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-6">
                                    {category.name}
                                </h1>
                                <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Left Column: Details & Advice */}
                    <div className="lg:col-span-1 space-y-12">
                        {/* Summary Card */}
                        <Reveal variants={slideUp}>
                            <div className="bg-secondary-50 rounded-3xl p-8 border border-secondary-100">
                                <h3 className="font-heading text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary-500" />
                                    Sobre este estilo
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                                        <p className="text-secondary-600 text-sm">Ideal para terrenos con {category.query.includes('garden') ? 'amplios jardines' : 'limitaciones de espacio'}.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                                        <p className="text-secondary-600 text-sm">Enfoque en la eficiencia energética y luz natural.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                                        <p className="text-secondary-600 text-sm">Materiales seleccionados para durabilidad extrema.</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Architectural Advice */}
                        <Reveal variants={slideUp}>
                            <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <Lightbulb className="w-10 h-10 text-primary-400 mb-6" />
                                <h3 className="font-heading text-xl font-bold mb-4">Consejo del Arquitecto</h3>
                                <p className="text-primary-100/80 text-sm leading-relaxed mb-6">
                                    "Para el estilo {category.name.toLowerCase()}, recomendamos priorizar la ventilación cruzada
                                    y el uso de ventanales de piso a techo para maximizar la conexión con el entorno."
                                </p>
                                <button className="flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors">
                                    Consultar un experto
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </Reveal>

                        {/* Top Subcategories */}
                        <Reveal variants={slideUp}>
                            <div className="space-y-4">
                                <h3 className="font-heading text-xl font-bold text-secondary-900 flex items-center gap-2">
                                    <Grid className="w-5 h-5 text-primary-500" />
                                    Sub-estilos
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.subcategories.map((sub, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-white border border-secondary-200 rounded-xl text-secondary-600 text-sm font-medium hover:border-primary-500 hover:text-primary-600 cursor-default transition-all">
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Column: Project Showcase */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="font-heading text-3xl font-bold text-secondary-900 flex items-center gap-3">
                                Proyectos en esta categoría
                                <span className="text-sm font-sans font-medium text-secondary-400 bg-secondary-100 px-3 py-1 rounded-full">
                                    {filteredProjects.length}
                                </span>
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {filteredProjects.map((project, idx) => (
                                <Reveal key={project.id} variants={slideUp} delay={idx * 0.1}>
                                    <ProjectCard
                                        project={project}
                                        variant="standard"
                                    />
                                </Reveal>
                            ))}
                        </div>

                        {/* Inspiration Gallery */}
                        <div className="pt-12 border-t border-secondary-100">
                            <h3 className="font-heading text-2xl font-bold text-secondary-900 mb-8 flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-primary-500" />
                                Inspiración del Estilo
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {categoryImages.slice(1).map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                                        <img
                                            src={img}
                                            alt="Inspiración"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailPage;
