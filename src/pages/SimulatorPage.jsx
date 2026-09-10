import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

/**
 * SimulatorPage — página de la ruta `/simulador`.
 *
 * Contendrá dos bloques independientes: el simulador de cuota y el buscador
 * del catálogo con filtros. Por ahora solo monta la estructura de la página.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function SimulatorPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.SIMULATOR]);

  return (
    <div className="page">
      <Navbar />

      <main className="page__main container container--7xl section">
        <h1 className="section__title section__title--page">Simulador de Crédito</h1>
        <p className="section__subtitle">
          Calcula tu cuota mensual y consulta cuánto pagarías en total
        </p>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
