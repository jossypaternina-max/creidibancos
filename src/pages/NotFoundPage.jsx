import { Link, useLocation } from 'react-router-dom';

import { NOT_FOUND_TITLE, ROUTES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

/**
 * NotFoundPage — página de la ruta comodín `*`.
 *
 * Réplica de la pantalla 404 de la Actividad 1, incluida su paleta slate
 * distinta al resto del sitio, el código "404", la regla horizontal, el texto
 * "Page Not Found" y el botón "Go Home" con su icono SVG inline.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function NotFoundPage() {
  const { pathname } = useLocation();
  useDocumentTitle(NOT_FOUND_TITLE);

  return (
    <div className="sys-page">
      <div className="sys-page__inner">
        <div className="sys-block">
          <div>
            <h1 className="sys-code">404</h1>
            <div className="sys-rule" />
          </div>

          <div>
            <h2 className="sys-title">Page Not Found</h2>
            <p className="sys-text">
              The page <span className="sys-text__highlight">&quot;{pathname}&quot;</span> could not
              be found in this application.
            </p>
          </div>

          <div className="sys-actions">
            <Link className="btn--system" to={ROUTES.CATALOG}>
              <HomeIcon />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Icono "home" idéntico al SVG inline del original. */
function HomeIcon() {
  return (
    <svg
      className="btn__icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}
