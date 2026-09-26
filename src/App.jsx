import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { ROUTES } from './config/routes.js';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';
import { SimulatorPage } from './pages/SimulatorPage.jsx';
import { ApplicationPage } from './pages/ApplicationPage.jsx';
import { MyApplicationsPage } from './pages/MyApplicationsPage.jsx';
import { HelpPage } from './pages/HelpPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

/**
 * App — shell y tabla de rutas de la aplicación.
 *
 * La barra superior, el pie y el enlace de salto viven aquí y no dentro de
 * cada página: son los mismos en las cinco rutas y en el 404, así que
 * repetirlos en cada página solo abría la puerta a que se desincronizaran.
 * Cada página aporta únicamente su contenido.
 *
 * Las rutas se leen de `config/routes.js`, que no importa nada: así
 * cualquier componente puede construir un enlace sin crear dependencias
 * circulares con las páginas.
 *
 * Capa: PRESENTACIÓN (enrutado).
 */
export function App() {
  return (
    <div className="page">
      <ScrollToTop />

      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <Navbar />

      <main className="page__main" id="contenido">
        <Routes>
          <Route path={ROUTES.CATALOG} element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={ROUTES.SIMULATOR} element={<SimulatorPage />} />
          <Route path={ROUTES.APPLICATION} element={<ApplicationPage />} />
          <Route path={ROUTES.MY_APPLICATIONS} element={<MyApplicationsPage />} />
          <Route path={ROUTES.HELP} element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Al cambiar de ruta se vuelve al principio de la página.
 *
 * Sin esto, entrar al simulador desde el pie de la home deja al usuario a
 * media pantalla de la nueva vista. Solo actúa al cambiar de `pathname`: una
 * interacción dentro de la misma ruta —filtrar, simular, cambiar de paso— no
 * mueve el scroll.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // `instant` respeta a quien pidió menos movimiento; el `smooth` global de
    // la hoja de estilos solo debe aplicarse a los saltos que el usuario pide.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
