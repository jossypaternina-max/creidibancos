/**
 * SortSelect — desplegable de ordenamiento del catálogo.
 *
 * El orden en que se muestran unos resultados es una decisión de interfaz, no
 * una regla de negocio: por eso vive en la presentación y se aplica sobre los
 * DTOs ya recibidos, sin volver a consultar el catálogo.
 *
 * @param {{
 *   options: Array<{ value: string, label: string }>,
 *   value: string,
 *   onChange: (value: string) => void,
 *   id?: string,
 *   label?: string
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function SortSelect({
  options,
  value,
  onChange,
  id = 'filter-sort',
  label = 'Ordenar por',
}) {
  return (
    <div>
      <label className="label label--block" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name="sortBy"
        className="control control--select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
