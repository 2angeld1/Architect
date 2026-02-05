import { usePathname } from 'next/navigation';

export const useLayout = () => {
  const pathname = usePathname();
  
    const isTransparentPage = ['/', '/proyectos', '/categorias', '/nosotros', '/checkout', '/promociones', '/construyendo-una-casa', '/casas-ya-hechas'].includes(pathname) ||
    pathname?.startsWith('/proyectos/') ||
    pathname?.startsWith('/categorias/');

  return {
    isTransparentPage
  };
};
