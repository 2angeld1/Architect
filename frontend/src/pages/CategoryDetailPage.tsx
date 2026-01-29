import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Info, 
  Lightbulb, 
  ChevronRight,
  Sparkles,
  Bed,
  Bath,
  Ruler,
  Maximize2
} from 'lucide-react';
import { allCategories } from '../mocks/categories';
import { mockProjects } from '../mocks/projects';
import { searchPhotos } from '../services/unsplash';
import Reveal from '../components/ui/Reveal';
import { fadeIn, slideUp, staggerContainer } from '../animations/variants';
import { motion } from 'framer-motion';

const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
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

  if (!category) return <div className="pt-24 text-center">Categoría no encontrada</div>;

  const adviceContent = [
    {
      title: "Optimización de Espacios",
      text: `Para las ${category.name}, recomendamos priorizar la iluminación natural y la circulación fluida. Los diseños de este tipo suelen beneficiarse de techos altos y ventanales estratégicos.`,
      icon: Maximize2
    },
    {
      title: "Elección de Materiales",
      text: "Sugerimos el uso de texturas que contrasten: concreto aparente con madera cálida, o acero con piedra natural, para resaltar el carácter único de este estilo arquitectónico.",
      icon: Sparkles
    },
    {
      title: "Sustentabilidad",
      text: "Integramos criterios de eficiencia energética mediante orientación pasiva y sistemas de recolección de agua, asegurando que tu inversión sea amigable con el medio ambiente.",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] bg-secondary-900 overflow-hidden">
        {categoryImages[0] && (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.5 }}
            src={categoryImages[0]} 
            alt={category.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/40 to-transparent" />
        
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Reveal variants={fadeIn}>
            <nav className="flex items-center gap-2 text-primary-400 text-sm mb-4">
              <Link to="/categorias" className="hover:text-primary-300 transition-colors">Categorías</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-secondary-300">{category.name}</span>
            </nav>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {category.name}
            </h1>
            <p className="text-secondary-200 text-lg max-w-2xl font-light">
              {category.description}. Explora nuestra selección curada de diseños que definen este estilo.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1 space-y-8">
            <Reveal variants={slideUp}>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-secondary-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-full -mr-8 -mt-8" />
                <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary-500" />
                  Asesoramiento
                </h2>
                <p className="text-secondary-600 mb-8 leading-relaxed">
                  Entender las particularidades de las <strong>{category.name}</strong> es fundamental antes de iniciar tu proyecto. Aquí te ofrecemos algunos consejos clave de nuestros expertos.
                </p>

                <div className="space-y-6">
                  {adviceContent.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-secondary-500 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-4 bg-secondary-900 rounded-xl text-white">
                  <p className="text-sm font-medium mb-3">¿Necesitas ayuda personalizada?</p>
                  <button className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold transition-all">
                    Hablar con un asesor
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal variants={slideUp} delay={0.2}>
               <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                 <h3 className="font-bold text-primary-900 mb-3 flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-primary-600" />
                   Sub-categorías
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {category.subcategories.map((sub, idx) => (
                     <span key={idx} className="px-3 py-1 bg-white text-primary-700 text-xs font-bold rounded-full border border-primary-200 shadow-sm">
                       {sub}
                     </span>
                   ))}
                 </div>
               </div>
            </Reveal>

            {/* Inspiration Gallery */}
            {categoryImages.length > 1 && (
              <Reveal variants={slideUp} delay={0.3}>
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary-100 mt-8">
                  <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    Inspiración del Estilo
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryImages.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden group">
                        <img 
                          src={img} 
                          alt={`Inspiración ${idx}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-secondary-400 mt-4 text-center italic">
                    Imágenes referenciales que definen la estética {category.name.toLowerCase()}
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-2">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-heading font-bold text-secondary-900">Proyectos Disponibles</h2>
               <span className="text-secondary-500 text-sm font-medium">{filteredProjects.length} resultados encontrados</span>
             </div>

             <motion.div 
               variants={staggerContainer}
               initial="initial"
               animate="animate"
               className="grid grid-cols-1 md:grid-cols-2 gap-8"
             >
               {filteredProjects.map((project) => (
                 <motion.div 
                   key={project.id}
                   variants={fadeIn}
                   className="group bg-white rounded-2xl overflow-hidden border border-secondary-100 shadow-sm hover:shadow-xl transition-all duration-300"
                 >
                   <Link to={`/proyectos/${project.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={project.images[0]} 
                          alt={project.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <button className="w-full py-2 bg-white text-secondary-900 font-bold rounded-lg flex items-center justify-center gap-2">
                            Ver Detalles <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                   </Link>
                   
                   <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight text-lg">
                          {project.name}
                        </h3>
                        <span className="text-primary-600 font-bold">
                          USD {project.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-secondary-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Ruler className="w-3.5 h-3.5" /> {project.area}m²
                        </div>
                        <div className="flex items-center gap-1">
                          < Bed className="w-3.5 h-3.5" /> {project.rooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" /> {project.bathrooms}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {project.category.split(' ').slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-[10px] font-bold rounded uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
          </div>

        </div>
      </div>

      <div className="bg-secondary-900 py-12 mt-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal variants={fadeIn}>
            <h3 className="text-2xl font-heading font-bold text-white mb-6">¿Aún no te decides?</h3>
            <p className="text-secondary-300 max-w-2xl mx-auto mb-8">
               Nuestros arquitectos expertos pueden ayudarte a seleccionar el proyecto que mejor se adapte 
               a las dimensiones de tu terreno y presupuesto.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                 Programar Videollamada <ArrowRight className="w-5 h-5" />
               </button>
               <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all">
                 Descargar Catálogo PDF
               </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
