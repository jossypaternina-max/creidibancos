import { Link } from 'react-router-dom';

import { ROUTES } from '../config/routes.js';

/**
 * CreditCard — tarjeta de un producto de crédito.
 *
 * Componente reutilizable con dos variantes, las mismas de la Actividad 1:
 *
 *  - `full` (Catálogo): cabecera grande, muestra requisitos y dos botones
 *    ("Ver detalles" → /simulador, "Solicitar" → /solicitar).
 *  - `compact` (Simulador): cabecera reducida, sin requisitos y un solo botón.
 *
 * Recibe un `CreditProductDTO` —nunca la entidad de dominio— por lo que no
 * puede ejecutar reglas de negocio desde la interfaz: todas las cifras llegan
 * ya formateadas desde la capa de aplicación.
 *
 * @param {{
 *   product: import('../application/dto/CreditProductDTO.js').CreditProductDTO,
 *   variant?: 'full'|'compact'
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function CreditCard({ product, variant = 'full' }) {
  const {
    name,
    description,
    requirements,
    icon,
    themeClass,
    annualRateLabel,
    maxTermMonths,
    maxTermLabel,
    amountRangeLabel,
  } = product;

  const isCompact = variant === 'compact';
  const cssClass = ['product-card', isCompact && 'product-card--compact', themeClass]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cssClass}>
      <div className="product-card__header">
        <span className="product-card__icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h3 className="product-card__name">{name}</h3>
          <span className="product-card__term">Hasta {maxTermMonths} meses</span>
        </div>
      </div>

      <div className="product-card__body">
        <p className="product-card__desc">{description}</p>

        <div className="product-card__metrics">
          <div>
            <p className="metric__label">Tasa anual</p>
            <p className="metric__value">{annualRateLabel}</p>
          </div>
          <div className="metric--right">
            <p className="metric__label">Plazo máx.</p>
            <p className="metric__value metric__value--sm">{maxTermLabel}</p>
          </div>
        </div>

        <div className="badge-amount">{amountRangeLabel}</div>

        {!isCompact && (
          <p className="product-card__requirements">
            <strong>Requisitos:</strong> {requirements}
          </p>
        )}
      </div>

      <div className="product-card__footer">
        {!isCompact && (
          <Link className="btn btn--outline-brand btn--card" to={ROUTES.SIMULATOR}>
            Ver detalles
          </Link>
        )}
        <Link className="btn btn--primary btn--card" to={ROUTES.APPLICATION}>
          Solicitar
        </Link>
      </div>
    </article>
  );
}
