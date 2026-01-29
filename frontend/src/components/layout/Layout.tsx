import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useLayout } from '../../hooks/useLayout';

const Layout = () => {
  const { isTransparentPage } = useLayout();

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
