import { NavLink } from 'react-router-dom';

import { ROUTES } from '../config/routes.js';

/**
 * Navbar — barra superior de navegación.
 *
 * Componente reutilizable y sin estado: su única entrada son las rutas, y
 * React Router decide cuál está activa. Réplica de la barra de la Actividad 1:
 *
 *  - Marca "CreditSmart" con "Smart" en esmeralda + "by FinTech Solutions".
 *  - Tres enlaces: Catálogo · Simulador · Solicitar.
 *  - El enlace de la ruta activa se resalta.
 *  - "Solicitar" se pinta como CTA sólido cuando NO es la ruta activa.
 *
 * Capa: PRESENTACIÓN (componente).
 */

/** Enlaces de la barra. `cta` marca el botón de llamada a la acción. */
const NAV_ITEMS = Object.freeze([
  { path: ROUTES.CATALOG, label: 'Catálogo', cta: false },
  { path: ROUTES.SIMULATOR, label: 'Simulador', cta: false },
  { path: ROUTES.APPLICATION, label: 'Solicitar', cta: true },
]);

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner container container--7xl">
        <div className="brand">
          <span className="brand__name">
            Credit<span className="brand__name-accent">Smart</span>
          </span>
          <span className="brand__tagline">by FinTech Solutions</span>
        </div>

        <div className="navbar__links">
          {NAV_ITEMS.map(({ path, label, cta }) => (
            <NavLink
              key={path}
              to={path}
              end={path === ROUTES.CATALOG}
              className={({ isActive }) =>
                ['navlink', isActive && 'navlink--active', !isActive && cta && 'navlink--cta']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
