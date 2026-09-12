/**
 * AmountRangeFilter — filtro por rango de monto.
 *
 * Los rangos NO están escritos aquí: llegan del caso de uso
 * `GetAmountRangeFiltersUseCase`, que los obtiene del puerto
 * `IAmountRangeProvider`. Así el filtro no duplica la lista y cambiarlos es
 * cambiar un dato, no un componente.
 *
 * Se pinta como deslizador en lugar de desplegable porque recorrer rangos
 * ordenados de menor a mayor es un gesto continuo, no una elección entre
 * opciones sueltas. El control sigue siendo un `input[type=range]` nativo:
 * flechas, inicio y fin funcionan sin añadir una línea de JavaScript, y
 * `aria-valuetext` hace que un lector de pantalla anuncie «Hasta $5.000.000»
 * en vez de «2».
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
  label = 'Monto deseado',
}) {
  // Sin rangos cargados todavía no hay nada que deslizar.
  if (ranges.length === 0) return null;

  const lastIndex = ranges.length - 1;
  const current = ranges[value] ?? ranges[0];

  return (
    <div className="filters__group">
      <label className="filters__legend" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        name="rangeIndex"
        type="range"
        className="range-control"
        min="0"
        max={lastIndex}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={current.label}
      />

      {/* Un solo texto bajo el deslizador: el rango elegido. Poner además
          los extremos de la escala repetiría «Todos los montos» dos veces y
          no ayudaría a leer en qué posición se está. */}
      <p className="amount-filter__current" aria-live="polite">
        {current.label}
      </p>
    </div>
  );
}
