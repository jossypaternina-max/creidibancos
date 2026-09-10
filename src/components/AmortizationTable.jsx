/**
 * AmortizationTable — tabla de amortización de la simulación.
 *
 * Va plegada por defecto y arranca en resumen anual: un crédito de vivienda a
 * 240 meses son 240 filas que nadie quiere de golpe.
 *
 * Las filas llegan ya calculadas en el `SimulationDTO`, en sus dos niveles de
 * detalle (`schedule` mes a mes y `yearlySummary` por año).
 *
 * @param {{
 *   simulation: Object,
 *   isOpen: boolean,
 *   mode: 'yearly'|'monthly',
 *   onToggle: () => void,
 *   onModeChange: (mode: 'yearly'|'monthly') => void
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function AmortizationTable({ simulation, isOpen, mode, onToggle, onModeChange }) {
  return (
    <section className="sim-schedule">
      <div className="sim-schedule__bar">
        <button
          type="button"
          className="btn btn--outline"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="sim-schedule-table"
        >
          {isOpen ? '▲ Ocultar' : '▼ Ver'} tabla de amortización ({simulation.schedule.length}{' '}
          cuotas)
        </button>

        {isOpen && (
          <div className="sim-schedule__modes" role="group" aria-label="Nivel de detalle">
            <button
              type="button"
              className={`btn btn--system ${mode === 'yearly' ? 'is-active' : ''}`}
              onClick={() => onModeChange('yearly')}
              aria-pressed={mode === 'yearly'}
            >
              Resumen anual
            </button>
            <button
              type="button"
              className={`btn btn--system ${mode === 'monthly' ? 'is-active' : ''}`}
              onClick={() => onModeChange('monthly')}
              aria-pressed={mode === 'monthly'}
            >
              Detalle mensual
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="sim-schedule__scroll" id="sim-schedule-table">
          {mode === 'monthly' ? (
            <MonthlyTable simulation={simulation} />
          ) : (
            <YearlyTable simulation={simulation} />
          )}
        </div>
      )}
    </section>
  );
}

/** @param {{ simulation: Object }} props */
function YearlyTable({ simulation }) {
  return (
    <table className="sim-table">
      <caption className="sim-table__caption">
        Resumen por año — {simulation.productName}
      </caption>
      <thead>
        <tr>
          <th scope="col">Año</th>
          <th scope="col">Cuotas</th>
          <th scope="col">Pagado</th>
          <th scope="col">Intereses</th>
          <th scope="col">Capital</th>
          <th scope="col">Saldo</th>
        </tr>
      </thead>
      <tbody>
        {simulation.yearlySummary.map((block) => (
          <tr key={block.year}>
            <th scope="row">{block.year}</th>
            <td>{block.rangeLabel}</td>
            <td>{block.paidLabel}</td>
            <td>{block.interestLabel}</td>
            <td>{block.principalLabel}</td>
            <td>{block.remainingBalanceLabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** @param {{ simulation: Object }} props */
function MonthlyTable({ simulation }) {
  return (
    <table className="sim-table">
      <caption className="sim-table__caption">
        Detalle mes a mes — {simulation.productName}
      </caption>
      <thead>
        <tr>
          <th scope="col">Cuota</th>
          <th scope="col">Pago</th>
          <th scope="col">Intereses</th>
          <th scope="col">Capital</th>
          <th scope="col">Saldo</th>
        </tr>
      </thead>
      <tbody>
        {simulation.schedule.map((row) => (
          <tr key={row.number}>
            <th scope="row">{row.number}</th>
            <td>{row.paymentLabel}</td>
            <td>{row.interestLabel}</td>
            <td>{row.principalLabel}</td>
            <td>{row.remainingBalanceLabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
