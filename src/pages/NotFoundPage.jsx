import { Link, useLocation } from 'react-router-dom';

import { NOT_FOUND_TITLE, ROUTES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { Icon } from '../components/Icon.jsx';

/**
 * NotFoundPage — página de la ruta comodín `*`.
 *
 * Deja de ser una pantalla aislada: conserva la barra superior y el pie, usa
 * los mismos tokens que el resto del sitio y está en español. Una página de
 * error que parece de otra aplicación hace dudar de que se siga en la misma.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function NotFoundPage() {
  const { pathname } = useLocation();
  useDocumentTitle(NOT_FOUND_TITLE);

  return (
    <div className="container container--reading not-found">
      <div className="not-found__card">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>

        <h1 className="not-found__title">No encontramos esta página</h1>

        <p className="not-found__text">
          La dirección puede haber cambiado o ya no estar disponible.
        </p>

        <p className="not-found__path">{pathname}</p>

        <div className="not-found__actions">
          <Link className="btn btn--primary" to={ROUTES.CATALOG}>
            <Icon name="home" className="ui-icon ui-icon--sm" />
            Volver al inicio
          </Link>

          <Link className="btn btn--outline" to={ROUTES.PRODUCTS}>
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
