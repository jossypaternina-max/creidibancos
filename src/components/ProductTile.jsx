import { Link } from 'react-router-dom';

import { ROUTES } from '../config/routes.js';
import { visualForProduct } from '../config/productVisualMap.js';
import { Icon } from './Icon.jsx';

/**
 * ProductTile — acceso rápido a un producto desde la home.
 *
 * Versión mínima de la tarjeta: pictograma, nombre y una frase corta. No
 * repite tasa, monto ni plazo porque su trabajo no es comparar, sino llevar
 * al catálogo con el producto ya en mente.
 *
 * A diferencia de `CreditCard`, aquí SÍ toda la pieza es un enlace: tiene un
 * único destino, así que convertirla en un solo objetivo agranda el área
 * pulsable en vez de esconder acciones.
 *
 * @param {{ product: Object }} props Recibe un `CreditProductDTO`.
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function ProductTile({ product }) {
  const { iconKey, shortName, shortBenefit, tone } = visualForProduct(product.id);
  const iconClass =
    tone === 'growth' ? 'product-tile__icon product-tile__icon--growth' : 'product-tile__icon';

  return (
    <Link className="product-tile" to={ROUTES.PRODUCTS}>
      <span className={iconClass} aria-hidden="true">
        <Icon name={iconKey} />
      </span>

      <span className="product-tile__name">{shortName || product.name}</span>
      <p className="product-tile__benefit">{shortBenefit}</p>
    </Link>
  );
}
