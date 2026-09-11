/**
 * SimulatorForm — formulario controlado del simulador.
 *
 * Producto, monto y plazo son entradas controladas: el valor lo manda el
 * estado del simulador y cada cambio se notifica. No hay botón "Calcular"
 * obligatorio porque la cuota se recalcula en cuanto cambia un valor; el
 * `onSubmit` solo evita que el formulario recargue la página.
 *
 * Los mensajes de error no se redactan aquí: llegan tal como los produjo el
 * dominio, por campo.
 *
 * @param {{
 *   catalog: Array<Object>,
 *   form: { productId: string, amount: string, termInMonths: string },
 *   bounds: Object|null,
 *   errors: Record<string, string>,
 *   onSelectProduct: (productId: string) => void,
 *   onAmountChange: (amount: string) => void,
 *   onTermChange: (term: string) => void,
 *   onReset: () => void
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function SimulatorForm({
  catalog,
  form,
  bounds,
  errors,
  onSelectProduct,
  onAmountChange,
  onTermChange,
  onReset,
}) {
  const productError = errors.productId ?? '';
  const amountError = errors.amount ?? '';
  const termError = errors.termInMonths ?? '';

  return (
    <form className="panel panel--simulator" onSubmit={(event) => event.preventDefault()}>
      <h2 className="panel__title">Simula tu crédito</h2>
      <p className="panel__hint">
        {bounds
          ? `Monto disponible: ${bounds.amountRangeLabel} · Plazo máximo: ${bounds.maxTermMonths} meses`
          : 'Elige un producto para empezar'}
      </p>

      <div className="grid-form">
        <div className="field">
          <label className="label label--block" htmlFor="sim-product">
            Producto de crédito
          </label>
          <select
            id="sim-product"
            name="productId"
            className={`control control--select ${productError ? 'is-invalid' : ''}`}
            value={form.productId}
            onChange={(event) => onSelectProduct(event.target.value)}
          >
            {catalog.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {product.annualRateLabel} E.A.
              </option>
            ))}
          </select>
          <span className="field__error" role="alert">
            {productError}
          </span>
        </div>

        <div className="field">
          <label className="label label--block" htmlFor="sim-amount">
            Monto a solicitar (COP)
          </label>
          <input
            id="sim-amount"
            name="amount"
            type="number"
            inputMode="numeric"
            className={`control ${amountError ? 'is-invalid' : ''}`}
            value={form.amount}
            onChange={(event) => onAmountChange(event.target.value)}
            min={bounds ? bounds.minAmount : undefined}
            max={bounds && bounds.maxAmount !== null ? bounds.maxAmount : undefined}
            step="100000"
            autoComplete="off"
            aria-invalid={amountError ? 'true' : undefined}
          />
          <span className="field__error" role="alert">
            {amountError}
          </span>
        </div>

        <div className="field">
          <label className="label label--block" htmlFor="sim-term">
            Plazo (meses)
          </label>
          <input
            id="sim-term"
            name="termInMonths"
            type="number"
            inputMode="numeric"
            className={`control ${termError ? 'is-invalid' : ''}`}
            value={form.termInMonths}
            onChange={(event) => onTermChange(event.target.value)}
            min="1"
            max={bounds ? bounds.maxTermMonths : undefined}
            step="1"
            autoComplete="off"
            aria-invalid={termError ? 'true' : undefined}
          />
          <span className="field__error" role="alert">
            {termError}
          </span>
        </div>
      </div>

      <div className="filters__actions">
        <button type="button" className="btn btn--outline" onClick={onReset}>
          Reiniciar
        </button>
      </div>
    </form>
  );
}
