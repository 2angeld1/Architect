import { Home, Layers, Zap, Building, Grid, Palette, FilePlus } from 'lucide-react';

export const megaMenuData = {
  categories: [
    { id: 'suelos', label: 'Suelos', icon: Home },
    { id: 'superficie', label: 'Superficie', icon: Grid },
    { id: 'garaje', label: 'Garaje', icon: Layers }, // Using Layers as generic placeholder
    { id: 'tejado', label: 'Tejado', icon: Home },
    { id: 'construccion', label: 'Construcción', icon: Building },
    { id: 'estilo', label: 'Estilo', icon: Palette },
    { id: 'edificios', label: 'Edificios', icon: Building },
    { id: 'eficiencia', label: 'Eficiencia Energética', icon: Zap },
    { id: 'adicionales', label: 'Elementos Adicionales', icon: FilePlus }
  ],
  content: {
    suelos: [
      { label: 'Diseños de casas Planta baja', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=200', tag: 'Popular' },
      { label: 'Diseños de casas con un desván utilizable', image: 'https://images.unsplash.com/photo-1600596542815-2a4d9fdb2278?auto=format&fit=crop&q=80&w=200' },
      { label: 'Diseños de casas con un desván para adaptaciones', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200' },
      { label: 'Diseños de casas De varias plantas', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=200' },
    ],
    // Default fallback for others
    default: [
      { label: 'Ver todos los diseños', image: '', link: '/proyectos' }
    ]
  },
  recommended: [
    { label: 'Últimas novedades', type: 'Diseños de casas', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
    { label: 'Populares', type: 'Diseños de casas', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
    { label: 'a un precio promocional', type: 'Diseños de casas', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
    { label: 'Con la construcción', type: 'Diseños de casas', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'barato de construir', type: 'Diseños de casas', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  ]
};
