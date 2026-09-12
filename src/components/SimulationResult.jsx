import { Link } from 'react-router-dom';

import { ROUTES, PREFILL_PARAMS } from '../config/routes.js';
import { Icon } from './Icon.jsx';

/**
 * SimulationResult — resumen de la simulación.
 *
 * Cuota mensual, tasa, monto, plazo, intereses, total y coste. Todas las
 * cifras llegan ya calculadas y formateadas en pesos dentro del
 * `SimulationDTO`: este componente no multiplica, no divide y no formatea.
 *
 * Jerarquía deliberada: la cuota es lo único en verde y lo único a tamaño
 * grande. Es el dato por el que el usuario entró al simulador; el resto
 * acompaña.
 *
 * El botón de solicitar lleva producto, monto y plazo en la URL. Se eligió
 * cadena de consulta en vez de estado del router para que el enlace
 * sobreviva a un refresco y se pueda compartir; el formulario vuelve a
 * validar los tres valores con las reglas de siempre.
 *
 * @param {{ simulation: Object }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function SimulationResult({ simulation }) {
  const {
    productId,
    productName,
    amount,
    amountLabel,
    termInMonths,
    termLabel,
    annualRateLabel,
    monthlyRateLabel,
    installmentLabel,
    totalInterestLabel,
    totalPaidLabel,
    interestRatioLabel,
    hasResidualAdjustment,
    finalInstallmentLabel,
  } = simulation;

  const applyParams = new URLSearchParams({
    [PREFILL_PARAMS.PRODUCT]: String(productId),
    [PREFILL_PARAMS.AMOUNT]: String(amount),
    [PREFILL_PARAMS.TERM]: String(termInMonths),
  });

  return (
    <section className="sim-result" aria-live="polite" aria-labelledby="resultado-titulo">
      <header className="sim-result__head">
        <div>
          <h2 className="sim-result__title" id="resultado-titulo">
            Resultado de la simulación
          </h2>
          <p className="sim-result__meta">{productName}</p>
        </div>
      </header>

      <div className="sim-result__hero">
        <p>
          <span className="sim-result__eyebrow">Tu cuota mensual estimada</span>
          <strong className="sim-result__payment">{installmentLabel}</strong>
        </p>

        <p>
          <span className="sim-result__rate-label">Tasa de interés</span>
          <strong className="sim-result__rate">{annualRateLabel}</strong>
          <span className="sim-result__rate-label">{monthlyRateLabel}</span>
        </p>
      </div>

      <div className="sim-result__facts">
        <Fact label="Monto solicitado" value={amountLabel} />
        <Fact label="Plazo" value={termLabel} />
        <Fact label="Total en intereses" value={totalInterestLabel} />
        <Fact label="Total a pagar" value={totalPaidLabel} />
        <Fact label="Coste del crédito" value={interestRatioLabel} />
      </div>

      {hasResidualAdjustment && (
        <p className="form-note">
          La última cuota es de <strong>{finalInstallmentLabel}</strong>: absorbe el ajuste por
          redondeo al peso de las {termInMonths} cuotas.
        </p>
      )}

      <p className="form-note">
        <Icon name="info" className="ui-icon ui-icon--sm" /> Esta simulación es informativa. Los
        valores finales pueden variar según las condiciones de la solicitud.
      </p>

      <div className="sim-result__actions">
        <Link
          className="btn btn--primary"
          to={`${ROUTES.APPLICATION}?${applyParams.toString()}`}
        >
          Solicitar este crédito
          <Icon name="arrow-right" className="ui-icon ui-icon--sm" />
        </Link>

        <Link className="btn btn--outline" to={ROUTES.PRODUCTS}>
          <Icon name="compare" className="ui-icon ui-icon--sm" />
          Comparar productos
        </Link>
      </div>
    </section>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Fact({ label, value }) {
  return (
    <p className="sim-result__fact">
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
}
