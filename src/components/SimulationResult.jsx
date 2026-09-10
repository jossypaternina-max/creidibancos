/**
 * SimulationResult — resumen de la simulación.
 *
 * Cuota mensual, total en intereses, total a pagar y coste del crédito. Todas
 * las cifras llegan ya calculadas y formateadas en pesos dentro del
 * `SimulationDTO`: este componente no multiplica, no divide y no formatea.
 *
 * @param {{ simulation: Object }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function SimulationResult({ simulation }) {
  const {
    productName,
    productIcon,
    themeClass,
    amountLabel,
    termLabel,
    annualRateLabel,
    monthlyRateLabel,
    installmentLabel,
    totalInterestLabel,
    totalPaidLabel,
    interestRatioLabel,
    hasResidualAdjustment,
    finalInstallmentLabel,
    termInMonths,
  } = simulation;

  return (
    <section className={`sim-result ${themeClass}`} aria-live="polite">
      <header className="sim-result__header">
        <span className="sim-result__icon" aria-hidden="true">
          {productIcon}
        </span>
        <div>
          <h2 className="sim-result__title">{productName}</h2>
          <p className="sim-result__meta">
            {amountLabel} a {termLabel} · {annualRateLabel} ({monthlyRateLabel})
          </p>
        </div>
      </header>

      <div className="sim-result__grid">
        <Metric label="Cuota mensual" value={installmentLabel} highlight />
        <Metric label="Total en intereses" value={totalInterestLabel} />
        <Metric label="Total a pagar" value={totalPaidLabel} />
        <Metric label="Coste del crédito" value={interestRatioLabel} />
      </div>

      {hasResidualAdjustment && (
        <p className="sim-result__note">
          La última cuota es de <strong>{finalInstallmentLabel}</strong>: absorbe el ajuste por
          redondeo al peso de las {termInMonths} cuotas.
        </p>
      )}
    </section>
  );
}

/**
 * @param {{ label: string, value: string, highlight?: boolean }} props
 */
function Metric({ label, value, highlight = false }) {
  return (
    <div className={highlight ? 'sim-metric sim-metric--highlight' : 'sim-metric'}>
      <span className="sim-metric__label">{label}</span>
      <span className="sim-metric__value">{value}</span>
    </div>
  );
}
