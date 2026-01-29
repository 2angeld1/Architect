import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const isTransparentPage = ['/', '/proyectos', '/categorias', '/nosotros', '/checkout'].includes(location.pathname) ||
    location.pathname.startsWith('/proyectos/') ||
    location.pathname.startsWith('/categorias/');

  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={isTransparentPage} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
