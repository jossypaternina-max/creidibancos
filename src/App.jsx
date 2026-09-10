import { Routes, Route } from 'react-router-dom';

import { ROUTES } from './config/routes.js';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { SimulatorPage } from './pages/SimulatorPage.jsx';
import { ApplicationPage } from './pages/ApplicationPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

/**
 * App — tabla de rutas de la aplicación.
 *
 * Sustituye al `HistoryRouter` de la Actividad 1: mismas rutas, mismo
 * comportamiento (navegación sin recarga), pero declaradas con React Router.
 *
 * Las rutas siguen leyéndose de `config/routes.js`, que no importa nada: así
 * cualquier componente puede construir un enlace sin crear dependencias
 * circulares con las páginas.
 *
 * Capa: PRESENTACIÓN (enrutado).
 */
export function App() {
  return (
    <Routes>
      <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
      <Route path={ROUTES.SIMULATOR} element={<SimulatorPage />} />
      <Route path={ROUTES.APPLICATION} element={<ApplicationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
