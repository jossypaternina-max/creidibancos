/**
 * SearchBar — campo de búsqueda por nombre de producto.
 *
 * Entrada controlada: el valor lo manda el estado de la página y cada
 * pulsación se notifica con `onChange`. Al no guardar estado propio, la
 * búsqueda se aplica mientras el usuario escribe sin pulsar ningún botón.
 *
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   id?: string,
 *   label?: string,
 *   placeholder?: string
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function SearchBar({
  value,
  onChange,
  id = 'filter-query',
  label = 'Buscar por nombre',
  placeholder = 'Ej: Crédito Vehículo...',
}) {
  return (
    <div>
      <label className="label label--block" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name="query"
        type="text"
        className="control"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
