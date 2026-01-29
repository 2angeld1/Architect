import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import AboutPage from './pages/AboutPage'
import CheckoutPage from './pages/CheckoutPage'
import PromotionsPage from './pages/PromotionsPage'
import BuildingGuidePage from './pages/BuildingGuidePage'
import ReadyMadeHousesPage from './pages/ReadyMadeHousesPage'
import ConfirmationPage from './pages/ConfirmationPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="proyectos" element={<ProjectsPage />} />
        <Route path="proyectos/:id" element={<ProjectDetailPage />} />
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="categorias/:id" element={<CategoryDetailPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="promociones" element={<PromotionsPage />} />
        <Route path="construyendo-una-casa" element={<BuildingGuidePage />} />
        <Route path="casas-ya-hechas" element={<ReadyMadeHousesPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmacion/:reservationId" element={<ConfirmationPage />} />
      </Route>
    </Routes>
  )
}

export default App
