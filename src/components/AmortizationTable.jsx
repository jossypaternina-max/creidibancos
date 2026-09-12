import { Icon } from './Icon.jsx';

/**
 * AmortizationTable — tabla de amortización de la simulación.
 *
 * Va plegada por defecto y arranca en resumen anual: un crédito de vivienda a
 * 240 meses son 240 filas que nadie quiere de golpe.
 *
 * Las filas llegan ya calculadas en el `SimulationDTO`, en sus dos niveles de
 * detalle (`schedule` mes a mes y `yearlySummary` por año).
 *
 * Cada fila añade una barra con el reparto capital/interés de ese pago. La
 * proporción se calcula aquí a partir de cifras crudas que ya venían en el
 * DTO —no se recalcula ningún importe— y es un COMPLEMENTO visual: los
 * números siguen estando en sus columnas, que es lo que se puede leer con un
 * lector de pantalla y lo que se imprime.
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
    <section className="sim-schedule" aria-labelledby="amortizacion-titulo">
      <div className="sim-schedule__bar">
        <button
          type="button"
          className="btn btn--outline"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="sim-schedule-table"
          id="amortizacion-titulo"
        >
          <Icon name={isOpen ? 'eye' : 'document'} className="ui-icon ui-icon--sm" />
          {isOpen ? 'Ocultar' : 'Ver'} tabla de amortización ({simulation.schedule.length} cuotas)
        </button>

        {isOpen && (
          <div className="sim-schedule__modes" role="group" aria-label="Nivel de detalle">
            <button
              type="button"
              className="sim-schedule__mode"
              onClick={() => onModeChange('yearly')}
              aria-pressed={mode === 'yearly'}
            >
              Resumen anual
            </button>
            <button
              type="button"
              className="sim-schedule__mode"
              onClick={() => onModeChange('monthly')}
              aria-pressed={mode === 'monthly'}
            >
              Detalle mensual
            </button>
          </div>
        )}

        {isOpen && (
          <p className="amortization-legend">
            <span className="amortization-legend__item">
              <span className="amortization-legend__swatch amortization-legend__swatch--capital" aria-hidden="true" />
              Capital
            </span>
            <span className="amortization-legend__item">
              <span className="amortization-legend__swatch amortization-legend__swatch--interest" aria-hidden="true" />
              Interés
            </span>
          </p>
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

/**
 * Reparto capital / interés de un pago, en porcentaje.
 *
 * @param {number} principal
 * @param {number} interest
 */
function SplitBar({ principal, interest }) {
  const total = principal + interest;
  if (total <= 0) return null;

  const capitalPct = (principal / total) * 100;

  return (
    <span className="amortization-bar" aria-hidden="true">
      <span className="amortization-bar__capital" style={{ width: `${capitalPct}%` }} />
      <span className="amortization-bar__interest" style={{ width: `${100 - capitalPct}%` }} />
    </span>
  );
}

/** @param {{ simulation: Object }} props */
function YearlyTable({ simulation }) {
  return (
    <table className="sim-table">
      <caption>Resumen por año — {simulation.productName}</caption>
      <thead>
        <tr>
          <th scope="col">Año</th>
          <th scope="col">Cuotas</th>
          <th scope="col">Pagado</th>
          <th scope="col">Intereses</th>
          <th scope="col">Capital</th>
          <th scope="col">Saldo</th>
          <th scope="col">Reparto</th>
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
            <td>
              <SplitBar principal={block.principal} interest={block.interest} />
            </td>
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
      <caption>Detalle mes a mes — {simulation.productName}</caption>
      <thead>
        <tr>
          <th scope="col">Cuota</th>
          <th scope="col">Pago</th>
          <th scope="col">Intereses</th>
          <th scope="col">Capital</th>
          <th scope="col">Saldo</th>
          <th scope="col">Reparto</th>
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
            <td>
              <SplitBar principal={row.principal} interest={row.interest} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
