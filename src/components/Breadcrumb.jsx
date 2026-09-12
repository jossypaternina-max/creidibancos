import { Link } from 'react-router-dom';

/**
 * Breadcrumb — migas de pan.
 *
 * Sitúan al usuario dentro de un trámite de varios pasos, que es justo donde
 * más fácil es perderse: catálogo, simulador y solicitud son tres paradas del
 * mismo camino.
 *
 * El último elemento nunca es un enlace —ya se está en él— y se marca con
 * `aria-current="page"`.
 *
 * @param {{ items: Array<{ label: string, to?: string }> }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.label}>
            {index > 0 && (
              <span className="breadcrumb__sep" aria-hidden="true">
                {' / '}
              </span>
            )}

            {isLast || !item.to ? (
              <span className="breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
