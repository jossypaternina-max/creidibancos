import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { NAV_ITEMS, ROUTES } from '../config/routes.js';
import { Icon } from './Icon.jsx';
import { Logo } from './Logo.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

/**
 * Navbar — barra superior de navegación.
 *
 * Cinco destinos, un CTA y el conmutador de tema. En escritorio la
 * navegación va centrada; por debajo de 1024 px se pliega en un panel
 * desplegable simple —no un off-canvas con foco atrapado, que exigiría
 * lógica de modal que el proyecto no necesita.
 *
 * La ruta activa se marca con `aria-current="page"`, que es a la vez la
 * semántica correcta y el gancho del CSS: no hay una clase paralela que
 * pueda quedar desincronizada.
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  /* Navegar cierra el panel: si no, al volver de una ruta el menú seguiría
     abierto tapando el contenido. */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar__inner container container--wide">
        <Link className="navbar__brand" to={ROUTES.CATALOG} aria-label="CreditSmart, ir al inicio">
          <Logo />
        </Link>

        <div className="navbar__nav">
          {NAV_ITEMS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === ROUTES.CATALOG}
              className="navbar__link"
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="navbar__actions">
          <ThemeToggle />

          <Link className="btn btn--primary navbar__cta" to={ROUTES.APPLICATION}>
            Iniciar solicitud
          </Link>

          <button
            type="button"
            className="navbar__menu-btn"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="navbar-drawer"
            aria-label={isOpen ? 'Cerrar el menú' : 'Abrir el menú'}
          >
            <Icon name={isOpen ? 'close' : 'menu'} className="ui-icon ui-icon--sm" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="navbar__drawer" id="navbar-drawer">
          <div className="navbar__drawer-inner container container--wide">
            {NAV_ITEMS.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end={path === ROUTES.CATALOG}
                className="navbar__link"
              >
                {label}
              </NavLink>
            ))}

            <Link className="btn btn--primary btn--block" to={ROUTES.APPLICATION}>
              Iniciar solicitud
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
