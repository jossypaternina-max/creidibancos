import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

/**
 * ApplicationPage — página de la ruta `/solicitar`.
 *
 * Contendrá el formulario controlado de solicitud en tres secciones
 * (Datos Personales · Datos del Crédito · Datos Laborales). Por ahora solo
 * monta la estructura de la página.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function ApplicationPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.APPLICATION]);

  return (
    <div className="page">
      <Navbar />

      <main className="page__main form-page">
        <h1 className="section__title section__title--page">Solicitar Crédito</h1>
        <p className="section__subtitle">
          Completa el formulario y un asesor se comunicará contigo.
        </p>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
