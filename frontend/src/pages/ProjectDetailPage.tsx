import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Ruler, 
  Bath, 
  BedDouble, 
  Check, 
  ArrowRight, 
  Info,
  Building2,
  FileText,
  ShieldCheck,
  Phone,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { mockProjects } from '../mocks/projects';
import { useCheckoutStore } from '../store/checkoutStore';
import { searchPhotos } from '../services/unsplash';
import Reveal from '../components/ui/Reveal';
import { fadeIn, slideUp } from '../animations/variants';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectProject, setReservationType } = useCheckoutStore();
  
  const [project, setProject] = useState(mockProjects.find(p => p.id === id));
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'plans'>('overview');

  useEffect(() => {
    const found = mockProjects.find(p => p.id === id);
    if (found) {
      setProject(found);
      searchPhotos('modern luxury house architecture', 10).then(photos => {
        if (photos.length > 0) {
          setProjectImages(photos.map(p => `${p.urls.regular}`));
        }
      });
    } else {
      navigate('/proyectos');
    }
  }, [id, navigate]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleBuyPlan = () => {
    if (project) {
      selectProject(project);
      setReservationType('purchase');
      navigate('/checkout');
    }
  };

  const handleRequestQuote = () => {
    if (project) {
      selectProject(project);
      setReservationType('quote');
      navigate('/checkout');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section (Reverted to original full-width style) */}
      <div className="relative h-[65vh] min-h-[500px] bg-secondary-900 overflow-hidden">
        {projectImages[0] && (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1 }}
            src={projectImages[0]} 
            alt={project.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/40 to-transparent" />
        
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24">
          <Reveal variants={slideUp}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider shadow-lg shadow-primary-500/20">
                  {project.category}
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                  {project.name}
                </h1>
                <p className="text-secondary-200 text-lg max-w-2xl font-light">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-3">
                 <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10">
                   <Share2 className="w-6 h-6" />
                 </button>
                 <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-rose-500/80 transition-all border border-white/10 group">
                   <Heart className="w-6 h-6 group-hover:fill-current" />
                 </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        {/* Stats Grid - Overlapping the Hero (Reverted to original style) */}
        <div className="-mt-20 lg:-mt-24 mb-12">
          <Reveal variants={slideUp} delay={0.1}>
             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-secondary-100 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-secondary-100">
               <div className="flex flex-col items-center text-center px-2">
                 <Ruler className="w-6 h-6 text-primary-500 mb-2" />
                 <span className="text-3xl font-bold text-secondary-900">{project.area}m²</span>
                 <span className="text-xs text-secondary-500 uppercase tracking-wide font-medium mt-1">Superficie</span>
               </div>
               <div className="flex flex-col items-center text-center px-2">
                 <BedDouble className="w-6 h-6 text-primary-500 mb-2" />
                 <span className="text-3xl font-bold text-secondary-900">{project.rooms}</span>
                 <span className="text-xs text-secondary-500 uppercase tracking-wide font-medium mt-1">Recámaras</span>
               </div>
               <div className="flex flex-col items-center text-center px-2">
                 <Bath className="w-6 h-6 text-primary-500 mb-2" />
                 <span className="text-3xl font-bold text-secondary-900">{project.bathrooms}</span>
                 <span className="text-xs text-secondary-500 uppercase tracking-wide font-medium mt-1">Baños</span>
               </div>
               <div className="flex flex-col items-center text-center px-2 border-l-0 md:border-l border-secondary-100">
                 <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                 <span className="text-2xl font-bold text-emerald-600">Disponible</span>
                 <span className="text-xs text-secondary-500 uppercase tracking-wide font-medium mt-1">Entrega Inmediata</span>
               </div>
             </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Gallery Carousel (Kept the new style, positioned here) */}
            <Reveal variants={fadeIn} delay={0.2}>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-xl text-secondary-900">Galería del Proyecto</h3>
                  <span className="text-sm text-secondary-500">{projectImages.length} imágenes</span>
                </div>
                
                <div className="relative aspect-video bg-secondary-900 rounded-2xl overflow-hidden group shadow-lg">
                  {projectImages.length > 0 ? (
                    <AnimatePresence mode='wait'>
                      <motion.img
                        key={currentImageIndex}
                        src={projectImages[currentImageIndex]}
                        alt={`Vista ${currentImageIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-500">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Controls */}
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={prevImage}
                      className="p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 hover:scale-110 transition-all border border-white/10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 hover:scale-110 transition-all border border-white/10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Image Counter Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1.5 border border-white/10">
                    <Maximize2 className="w-3 h-3" />
                    {currentImageIndex + 1} / {projectImages.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {projectImages.length > 0 && (
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                    {projectImages.slice(0, 6).map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative rounded-lg overflow-hidden aspect-[4/3] border-2 transition-all ${
                          currentImageIndex === idx 
                            ? 'border-primary-500 ring-2 ring-primary-500/20 opacity-100' 
                            : 'border-transparent opacity-60 hover:opacity-100 hover:border-secondary-300'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Tabs & Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
               <div className="flex border-b border-secondary-100 overflow-x-auto">
                 <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 px-6 font-medium text-sm transition-colors text-center border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-transparent text-secondary-500 hover:text-secondary-800 hover:bg-secondary-50'}`}
                 >
                   Descripción General
                 </button>
                 <button 
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-4 px-6 font-medium text-sm transition-colors text-center border-b-2 whitespace-nowrap ${activeTab === 'features' ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-transparent text-secondary-500 hover:text-secondary-800 hover:bg-secondary-50'}`}
                 >
                   Características
                 </button>
                 <button 
                  onClick={() => setActiveTab('plans')}
                  className={`flex-1 py-4 px-6 font-medium text-sm transition-colors text-center border-b-2 whitespace-nowrap ${activeTab === 'plans' ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-transparent text-secondary-500 hover:text-secondary-800 hover:bg-secondary-50'}`}
                 >
                   Planos y Vistas
                 </button>
               </div>

               <div className="p-8">
                 <AnimatePresence mode="wait">
                   {activeTab === 'overview' && (
                     <motion.div 
                       key="overview"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.2 }}
                     >
                       <div className="prose prose-lg text-secondary-600 max-w-none">
                         <p>
                           {project.description} Este proyecto se destaca por su integración armoniosa con el entorno, utilizando materiales locales y técnicas de construcción eficientes.
                         </p>
                       </div>
                       
                       <div className="grid sm:grid-cols-2 gap-4 mt-8">
                         {[
                           'Planos Arquitectónicos Completos',
                           'Cálculo Estructural Sugerido',
                           'Guía de Instalaciones Básicas',
                           'Renders Fotorrealistas',
                           'Lista de Acabados Sugeridos',
                           'Licencia de Uso Personal'
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
                             <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                               <Check className="w-5 h-5 text-emerald-600" />
                             </div>
                             <span className="text-secondary-700 font-medium">{item}</span>
                           </div>
                         ))}
                       </div>

                       <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-100 flex gap-4">
                         <Info className="w-6 h-6 text-primary-600 shrink-0 mt-1" />
                         <div>
                           <h5 className="font-bold text-primary-900 mb-1">Flexibilidad de Diseño</h5>
                           <p className="text-sm text-primary-700">
                             Nuestros planos se entregan en formatos editables (CAD) para facilitar cualquier adaptación local que requiera tu terreno o normativa.
                           </p>
                         </div>
                       </div>
                     </motion.div>
                   )}

                   {/* Other tabs logic remains similar but simplified/cleaned for brevity */}
                   {activeTab === 'features' && (
                      <motion.div key="features" {...fadeIn}>
                         <div className="grid md:grid-cols-2 gap-8">
                           <div>
                             <h4 className="font-bold text-secondary-900 border-b border-secondary-200 pb-2 mb-4">Exterior</h4>
                             <ul className="space-y-3 text-secondary-600">
                               <li className="flex gap-2"><span className="text-primary-500">•</span> Fachada de bajo mantenimiento</li>
                               <li className="flex gap-2"><span className="text-primary-500">•</span> Iluminación LED perimetral</li>
                               <li className="flex gap-2"><span className="text-primary-500">•</span> Terraza techada con vigas aparentes</li>
                             </ul>
                           </div>
                           <div>
                             <h4 className="font-bold text-secondary-900 border-b border-secondary-200 pb-2 mb-4">Interior</h4>
                             <ul className="space-y-3 text-secondary-600">
                               <li className="flex gap-2"><span className="text-primary-500">•</span> Altura libre de 2.80m</li>
                               <li className="flex gap-2"><span className="text-primary-500">•</span> Pisos de gran formato</li>
                               <li className="flex gap-2"><span className="text-primary-500">•</span> Carpintería integrada de diseño</li>
                             </ul>
                           </div>
                         </div>
                      </motion.div>
                   )}
                   
                   {activeTab === 'plans' && (
                     <motion.div key="plans" {...fadeIn}>
                       <div className="flex flex-col items-center justify-center py-12 text-center bg-secondary-50 border border-dashed border-secondary-300 rounded-xl">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <FileText className="w-8 h-8 text-primary-500" />
                         </div>
                         <h4 className="text-lg font-bold text-secondary-900">Previsualización de Distribución</h4>
                         <p className="text-secondary-500 max-w-md mt-2 mb-6">
                           Obtén una vista esquemática gratuita antes de comprar el paquete completo de planos constructivos.
                         </p>
                         <button className="px-6 py-2.5 bg-white border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
                           Ver PDF (Esquema)
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </div>

          {/* Sticky Sidebar (Unchanged logic, just layout context) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-100 to-transparent opacity-50 rounded-bl-full -mr-10 -mt-10" />
                
                <div className="mb-6 pb-6 border-b border-secondary-100 relative z-10">
                  <p className="text-sm text-secondary-500 mb-1 font-medium">Precio del paquete completo</p>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary-600 tracking-tight">
                      {formatPrice(project.price, project.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-400 font-medium line-through">
                      {formatPrice(project.price * 1.2, project.currency)}
                    </span> 
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
                      Oferta Limitada
                    </span>
                  </div>
                </div>

                <div className="space-y-3 relative z-10">
                  <button 
                    onClick={handleBuyPlan}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform active:scale-[0.98]"
                  >
                    Comprar Planos Ahora
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleRequestQuote}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-secondary-200 text-secondary-700 font-bold rounded-xl hover:bg-secondary-50 hover:border-secondary-300 transition-colors"
                  >
                    Cotizar Construcción
                    <Building2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-5 pt-5 border-t border-secondary-100 text-center">
                   <p className="text-xs text-secondary-400 flex items-center justify-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transacción encriptada
                   </p>
                </div>
              </div>

               <div className="bg-secondary-900 rounded-2xl p-6 text-white text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
                 <div className="absolute inset-0 bg-primary-600/10 group-hover:bg-primary-600/20 transition-colors" />
                 <Phone className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                 <h4 className="font-bold mb-2 relative z-10">¿Dudas técnicas?</h4>
                 <p className="text-sm text-secondary-300 mb-4 relative z-10">
                   Habla directamente con uno de nuestros arquitectos senior.
                 </p>
                 <button className="relative z-10 text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors w-full">
                   Agendar Llamada
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
