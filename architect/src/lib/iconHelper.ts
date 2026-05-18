import { 
  Home, 
  Building2, 
  TreePine, 
  Layers, 
  Minimize2, 
  Car, 
  Warehouse, 
  Castle, 
  Tent,
  HelpCircle,
  Sparkles,
  Flame,
  Hammer,
  Brush,
  Compass,
  Heart,
  Sun,
  Moon
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Home,
  Building2,
  TreePine,
  Layers,
  Minimize2,
  Car,
  Warehouse,
  Castle,
  Tent,
  Sparkles,
  Flame,
  Hammer,
  Brush,
  Compass,
  Heart,
  Sun,
  Moon
};

export function getCategoryIcon(name: string) {
  if (!name) return Home;
  const normalized = name.trim();
  return iconMap[normalized] || iconMap[normalized.charAt(0).toUpperCase() + normalized.slice(1)] || HelpCircle;
}

export const AVAILABLE_ICONS = Object.keys(iconMap);
