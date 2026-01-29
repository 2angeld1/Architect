import { useLocation } from 'react-router-dom';

export const useLayout = () => {
  const location = useLocation();
  
    const isTransparentPage = ['/', '/proyectos', '/categorias', '/nosotros', '/checkout', '/promociones', '/construyendo-una-casa', '/casas-ya-hechas'].includes(location.pathname) ||
    location.pathname.startsWith('/proyectos/') ||
    location.pathname.startsWith('/categorias/');

  return {
    isTransparentPage
  };
};
