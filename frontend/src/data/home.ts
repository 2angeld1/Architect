import { 
  Shield, 
  Clock, 
  Award, 
  HeartHandshake, 
  Truck, 
  RefreshCw,
  Search,
  Download,
  Hammer,
  FileCheck,
  Home,
  Building2,
  Warehouse
} from 'lucide-react';

export const benefits = [
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Pagos protegidos y garantía de satisfacción en cada proyecto',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Clock,
    title: 'Entrega Inmediata',
    description: 'Descarga tus planos al instante después de la compra',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Award,
    title: 'Calidad Premium',
    description: 'Diseños que cumplen normativas locales e internacionales',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: HeartHandshake,
    title: 'Soporte Experto',
    description: 'Asesoría profesional durante todo el proceso',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'Documentación física sin costo adicional',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: RefreshCw,
    title: 'Garantía de Cambio',
    description: '30 días para cambiar tu proyecto si no te convence',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

export const processSteps = [
  {
    icon: Search,
    title: '1. Encuentra tu Diseño',
    description: 'Explora nuestra colección de planos premium y usa los filtros para hallar el diseño que se adapta a tu terreno y estilo de vida.',
  },
  {
    icon: Download,
    title: '2. Descarga Inmediata',
    description: 'Recibe los archivos digitales completos (PDF y CAD) al instante después de tu compra segura. Sin esperas.',
  },
  {
    icon: FileCheck,
    title: '3. Adapta y Tramita',
    description: 'Nuestros planos incluyen toda la información técnica necesaria para que tu ingeniero local realice los trámites municipales.',
  },
  {
    icon: Hammer,
    title: '4. Construye tu Sueño',
    description: 'Entrega los planos a tu contratista y comienza la construcción con la seguridad de un diseño arquitectónico profesional.',
  },
];

export const quickCategories = [
  { icon: Home, label: 'Casas', count: '320+' },
  { icon: Building2, label: 'Departamentos', count: '85+' },
  { icon: Warehouse, label: 'Comercial', count: '45+' },
];

export const heroSlideContent = [
  {
    title: 'Diseña tu Hogar Ideal',
    subtitle: 'Más de 500 proyectos arquitectónicos listos para construir',
  },
  {
    title: 'Arquitectura Moderna',
    subtitle: 'Planos detallados con las últimas tendencias de diseño',
  },
  {
    title: 'Tu Proyecto, Tu Estilo',
    subtitle: 'Casas modernas, clásicas y contemporáneas',
  },
];

export const resourcesArticles = [
  {
    id: 1,
    title: 'Guía 2026: Costos reales de construir una casa',
    category: 'Finanzas',
    excerpt: 'Analizamos los precios actuales de materiales y mano de obra para que planifiques tu presupuesto sin sorpresas.',
    date: 'Ene 24, 2026',
    query: 'construction budget cost',
  },
  {
    id: 2,
    title: '¿Cómo elegir el terreno perfecto?',
    category: 'Consejos',
    excerpt: '10 factores clave que debes revisar antes de comprar un lote: orientación, suelo, servicios y normativa.',
    date: 'Ene 18, 2026',
    query: 'land measurement surveyor',
  },
  {
    id: 3,
    title: 'Tendencias de Arquitectura Sostenible',
    category: 'Diseño',
    excerpt: 'Descubre cómo los nuevos materiales y diseños pasivos pueden ahorrarte hasta un 40% en energía.',
    date: 'Ene 10, 2026',
    query: 'sustainable modern house green',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Propietaria',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    content: 'Excepcional servicio y calidad en los planos. El proceso fue muy sencillo y el resultado superó mis expectativas. Mi casa quedó exactamente como la soñé.',
    rating: 5,
    project: 'Casa Aurora',
  },
  {
    id: 2,
    name: 'Roberto Hernández',
    role: 'Constructor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    content: 'Como constructor, he trabajado con muchos proveedores de planos. Archiquect destaca por la precisión técnica y el nivel de detalle en sus proyectos.',
    rating: 5,
    project: 'Villa Serena',
  },
  {
    id: 3,
    name: 'Ana Martínez',
    role: 'Arquitecta',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    content: 'Recomiendo Archiquect a todos mis clientes. Los diseños son modernos, funcionales y fáciles de adaptar. El soporte técnico es excepcional.',
    rating: 5,
    project: 'Casa Minimal',
  },
  {
    id: 4,
    name: 'Carlos Rodríguez',
    role: 'Propietario',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    content: 'Desde la compra hasta la construcción, todo fue perfecto. El equipo siempre estuvo disponible para resolver mis dudas. 100% recomendado.',
    rating: 5,
    project: 'Residencia Luna',
  },
];

export const comparisonFeatures = {
  traditional: [
    'Tiempo de diseño: 3 a 6 meses',
    'Costos elevados (4-10% del valor de obra)',
    'Resultado final incierto hasta terminar',
    'Costos extra por cada corrección',
  ],
  archiquect: [
    'Tiempo de entrega: Inmediato',
    'Ahorro de hasta 80% en diseño',
    'Ves exactamente lo que compras (3D/Planos)',
    'Documentación técnica completa incluida',
  ],
};
