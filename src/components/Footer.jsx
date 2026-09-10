/**
 * Footer — pie de página.
 *
 * Componente reutilizable con dos variantes, las mismas de la Actividad 1:
 *  - `catalog`  → margen superior corto y segunda línea larga.
 *  - `compact`  → margen superior mayor y segunda línea corta.
 *
 * Capa: PRESENTACIÓN (componente).
 */

const COMPANY = 'CreditSmart — FinTech Solutions S.A.S';
const RIGHTS_SHORT = '© 2025 Todos los derechos reservados';
const RIGHTS_LONG =
  '© 2025 Todos los derechos reservados · Plataforma de solicitudes de crédito en línea';

/**
 * @param {{ variant?: 'catalog'|'compact' }} props
 */
export function Footer({ variant = 'compact' }) {
  const isCatalog = variant === 'catalog';

  return (
    <footer className={isCatalog ? 'footer' : 'footer footer--spaced'}>
      <p className="footer__brand">{COMPANY}</p>
      <p>{isCatalog ? RIGHTS_LONG : RIGHTS_SHORT}</p>
    </footer>
  );
}
