/**
 * AmountRangeFilter — desplegable de filtro por rango de monto.
 *
 * Las opciones no están escritas aquí: llegan del caso de uso
 * `GetAmountRangeFiltersUseCase`, que las obtiene del puerto
 * `IAmountRangeProvider`. Así el filtro no duplica la lista de rangos y
 * cambiarlos es cambiar un dato, no un componente.
 *
 * @param {{
 *   ranges: Array<{ index: number, label: string }>,
 *   value: number,
 *   onChange: (index: number) => void,
 *   id?: string,
 *   label?: string
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function AmountRangeFilter({
  ranges,
  value,
  onChange,
  id = 'filter-range',
  label = 'Filtrar por rango de monto',
}) {
  return (
    <div>
      <label className="label label--block" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name="rangeIndex"
        className="control control--select"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {ranges.map((range) => (
          <option key={range.index} value={range.index}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}
