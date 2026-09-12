import { Link } from 'react-router-dom';

import { ROUTES } from '../config/routes.js';
import { visualForProduct } from '../config/productVisualMap.js';
import { Icon } from './Icon.jsx';

/**
 * CreditCard — tarjeta de un producto de crédito.
 *
 * Anatomía del diseño aprobado, de arriba abajo: pictograma en chip circular,
 * distintivo opcional, nombre, tasa, dos datos con icono y una sola acción a
 * ancho completo.
 *
 * La descripción y los requisitos NO se pintan aquí: alargaban la tarjeta
 * hasta romper la rejilla y convertían una pieza de comparación en un bloque
 * de lectura. Siguen estando en la aplicación, en las preguntas frecuentes
 * (`/ayuda`), que es donde alguien los busca de verdad.
 *
 * Recibe un `CreditProductDTO` —nunca la entidad de dominio— por lo que no
 * puede ejecutar reglas de negocio desde la interfaz: todas las cifras llegan
 * ya formateadas desde la capa de aplicación.
 *
 * El pictograma y el tono del chip los resuelve `productVisualMap`, que es
 * configuración de presentación: el dominio nunca almacena rutas de SVG.
 *
 * @param {{
 *   product: import('../application/dto/CreditProductDTO.js').CreditProductDTO,
 *   variant?: 'full'|'compact',
 *   badge?: string
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function CreditCard({ product, variant = 'full', badge = '' }) {
  const { id, name, annualRateLabel, maxTermMonths, maxAmountLabel } = product;

  const { iconKey, tone } = visualForProduct(id);
  const isCompact = variant === 'compact';

  const cardClass = isCompact ? 'product-card product-card--compact' : 'product-card';
  const iconClass =
    tone === 'growth' ? 'product-card__icon product-card__icon--growth' : 'product-card__icon';

  return (
    <article className={cardClass}>
      <div className="product-card__top">
        <span className={iconClass} aria-hidden="true">
          <Icon name={iconKey} />
        </span>

        {badge && <span className="product-card__badge">{badge}</span>}
      </div>

      <h3 className="product-card__name">{name}</h3>

      <p className="product-card__rate">
        Desde <strong>{annualRateLabel}</strong> E.A.
      </p>

      <div className="product-card__facts">
        <span className="product-card__fact">
          <Icon name="money" />
          Hasta {maxAmountLabel}
        </span>
        <span className="product-card__fact">
          <Icon name="calendar" />
          Hasta {maxTermMonths} meses
        </span>
      </div>

      <div className="product-card__footer">
        <Link className="btn btn--soft btn--block" to={ROUTES.SIMULATOR}>
          {isCompact ? 'Simular' : 'Ver detalles'}
          <Icon name="arrow-right" className="ui-icon ui-icon--sm" />
        </Link>
      </div>
    </article>
  );
}
