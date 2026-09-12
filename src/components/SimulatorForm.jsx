import { Icon } from './Icon.jsx';

/**
 * SimulatorForm — panel de entrada del simulador.
 *
 * Producto, monto y plazo son entradas controladas: el valor lo manda el
 * estado del simulador y cada cambio se notifica. No hay botón «Calcular»
 * porque la cuota se recalcula en cuanto cambia un valor; el `onSubmit` solo
 * evita que el formulario recargue la página.
 *
 * El monto se edita de dos formas sincronizadas sobre el mismo estado:
 *
 *  - un `input[type=number]`, que es el control accesible y el que anuncia
 *    un lector de pantalla;
 *  - un `input[type=range]` y unos atajos de porcentaje, que evitan teclear
 *    «5000000» a mano.
 *
 * El deslizador NO sustituye al campo ni a la validación: los límites que
 * pinta salen del producto y el dominio vuelve a comprobarlos igualmente.
 *
 * Los mensajes de error no se redactan aquí: llegan tal como los produjo el
 * dominio, por campo. Los importes tampoco se formatean aquí: las etiquetas
 * en pesos vienen ya hechas dentro del DTO del producto.
 *
 * Capa: PRESENTACIÓN (componente).
 */

/** Atajos de monto, como fracción del rango del producto. */
const AMOUNT_PRESETS = Object.freeze([
  { label: '25%', factor: 0.25 },
  { label: '50%', factor: 0.5 },
  { label: '75%', factor: 0.75 },
  { label: 'Máximo', factor: 1 },
]);

export function SimulatorForm({
  catalog,
  form,
  bounds,
  errors,
  termOptions = [],
  onSelectProduct,
  onAmountChange,
  onTermChange,
  onReset,
}) {
  const productError = errors.productId ?? '';
  const amountError = errors.amount ?? '';
  const termError = errors.termInMonths ?? '';

  const minAmount = bounds ? bounds.minAmount : 0;
  const maxAmount = bounds && bounds.maxAmount !== null ? bounds.maxAmount : minAmount;
  const amountValue = Number(form.amount) || 0;

  /* Un paso fijo de 100.000 dejaría el máximo fuera de alcance en unos
     productos y daría saltos ridículos en otros. Se deriva del rango. */
  const amountStep = Math.max(100000, Math.round((maxAmount - minAmount) / 100));

  /** Plazos sugeridos que este producto admite. */
  const suggestedTerms = bounds
    ? termOptions.filter((months) => months <= bounds.maxTermMonths)
    : [];

  /** @param {number} factor */
  function applyPreset(factor) {
    const value = Math.round(minAmount + (maxAmount - minAmount) * factor);
    onAmountChange(String(value));
  }

  return (
    <form className="simulator-shell" onSubmit={(event) => event.preventDefault()}>
      <div>
        <h2 className="simulator-shell__title">Simula tu crédito</h2>
        <p className="simulator-shell__intro">
          Ajusta el monto y el plazo para ver una estimación de tu cuota mensual.
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="sim-product">
          Tipo de crédito
        </label>

        <div className="select-wrap">
          <select
            id="sim-product"
            name="productId"
            className="field__control"
            value={form.productId}
            onChange={(event) => onSelectProduct(event.target.value)}
            aria-invalid={productError ? 'true' : undefined}
            aria-describedby={productError ? 'sim-product-error' : undefined}
          >
            {catalog.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <Icon name="chevron-down" className="ui-icon select-wrap__chevron" />
        </div>

        <p className="field__error" id="sim-product-error" role="alert">
          {productError}
        </p>
      </div>

      <div className="field simulator-shell__amount">
        <label className="field__label" htmlFor="sim-amount">
          Monto del crédito
        </label>

        <input
          id="sim-amount"
          name="amount"
          type="number"
          inputMode="numeric"
          className="field__control"
          value={form.amount}
          onChange={(event) => onAmountChange(event.target.value)}
          min={minAmount}
          max={maxAmount || undefined}
          step={amountStep}
          autoComplete="off"
          aria-invalid={amountError ? 'true' : undefined}
          aria-describedby={amountError ? 'sim-amount-error' : 'sim-amount-hint'}
        />

        {/* El deslizador es un control secundario del MISMO valor: por eso no
            repite la etiqueta y anuncia el importe con `aria-valuetext`. */}
        <input
          type="range"
          className="range-control"
          value={amountValue}
          onChange={(event) => onAmountChange(event.target.value)}
          min={minAmount}
          max={maxAmount || minAmount + 1}
          step={amountStep}
          aria-label="Ajustar el monto del crédito"
          aria-valuetext={bounds ? `${form.amount} pesos` : undefined}
        />

        {bounds && (
          <p className="simulator-shell__range-labels">
            <span>{bounds.minAmountLabel}</span>
            <span>{bounds.maxAmountLabel}</span>
          </p>
        )}

        <div className="amount-filter__presets">
          {AMOUNT_PRESETS.map(({ label, factor }) => (
            <button
              type="button"
              className="amount-filter__preset"
              key={label}
              onClick={() => applyPreset(factor)}
              disabled={!bounds}
            >
              {label}
            </button>
          ))}
        </div>

        {bounds && (
          <p className="field__hint" id="sim-amount-hint">
            Disponible entre {bounds.minAmountLabel} y {bounds.maxAmountLabel}.
          </p>
        )}

        <p className="field__error" id="sim-amount-error" role="alert">
          {amountError}
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="sim-term">
          Plazo (meses)
        </label>

        <input
          id="sim-term"
          name="termInMonths"
          type="number"
          inputMode="numeric"
          className="field__control"
          value={form.termInMonths}
          onChange={(event) => onTermChange(event.target.value)}
          min="1"
          max={bounds ? bounds.maxTermMonths : undefined}
          step="1"
          autoComplete="off"
          aria-invalid={termError ? 'true' : undefined}
          aria-describedby={termError ? 'sim-term-error' : 'sim-term-hint'}
        />

        {suggestedTerms.length > 0 && (
          <div className="amount-filter__presets">
            {suggestedTerms.map((months) => (
              <button
                type="button"
                className="amount-filter__preset"
                key={months}
                onClick={() => onTermChange(String(months))}
                aria-pressed={String(months) === String(form.termInMonths)}
              >
                {months} m
              </button>
            ))}
          </div>
        )}

        {bounds && (
          <p className="field__hint" id="sim-term-hint">
            Máximo {bounds.maxTermMonths} meses para este producto.
          </p>
        )}

        <p className="field__error" id="sim-term-error" role="alert">
          {termError}
        </p>
      </div>

      <div className="simulator-shell__actions">
        <button type="button" className="btn btn--on-panel" onClick={onReset}>
          <Icon name="refresh" className="ui-icon ui-icon--sm" />
          Reiniciar
        </button>
      </div>
    </form>
  );
}
