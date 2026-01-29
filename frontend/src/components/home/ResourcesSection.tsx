import { ArrowRight, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchPhotos } from '../../services/unsplash';
import { resourcesArticles } from '../../data/home';

const ResourcesSection = () => {
  const [images, setImages] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      // Fetch custom images for each article query
        for (const article of resourcesArticles) {
        try {
          const photos = await searchPhotos(article.query, 1);
          if (photos.length > 0) {
            setImages(prev => ({
              ...prev,
              [article.id]: `${photos[0].urls.raw}&w=600&q=80&fit=crop`
            }));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider font-sans">
              Blog y Recursos
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-secondary-800 mt-2">
              Asesoría Experta
            </h2>
            <p className="text-secondary-600 mt-3 max-w-xl font-sans">
              Artículos y guías para ayudarte en cada etapa de tu construcción
            </p>
          </div>
          <button className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2 group font-sans">
            Ver todos los artículos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
                  {resourcesArticles.map((article) => (
            <article key={article.id} className="group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5">
                {images[article.id] ? (
                  <img
                    src={images[article.id]}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary-100 flex items-center justify-center text-secondary-400">
                    Loading...
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-secondary-800 uppercase tracking-wide">
                  {article.category}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-secondary-500 mb-3 font-sans">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>

              <h3 className="font-heading text-xl font-bold text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
                {article.title}
              </h3>

              <p className="text-secondary-600 text-sm leading-relaxed mb-4 font-sans flex-grow">
                {article.excerpt}
              </p>

              <span className="text-primary-600 font-medium text-sm inline-flex items-center gap-1 mt-auto group-hover:underline font-sans">
                Leer artículo
                <ArrowRight className="w-3 h-3" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
