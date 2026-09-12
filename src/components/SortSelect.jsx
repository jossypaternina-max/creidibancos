import { Icon } from './Icon.jsx';

/**
 * SortSelect — desplegable genérico con la flecha del sistema de iconos.
 *
 * Se conserva el `<select>` nativo a propósito: ya trae teclado, lector de
 * pantalla y el selector a pantalla completa del móvil. Un desplegable
 * propio en JavaScript tendría que reimplementar las tres cosas y casi
 * siempre las reimplementa peor.
 *
 * El orden en que se muestran unos resultados es una decisión de interfaz, no
 * una regla de negocio: por eso vive en la presentación y se aplica sobre los
 * DTOs ya recibidos, sin volver a consultar el catálogo.
 *
 * @param {{
 *   options: Array<{ value: string|number, label: string }>,
 *   value: string|number,
 *   onChange: (value: string) => void,
 *   id?: string,
 *   label?: string,
 *   name?: string
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
  name = 'sortBy',
}) {
  return (
    <div className="filters__group">
      <label className="filters__legend" htmlFor={id}>
        {label}
      </label>

      <div className="select-wrap">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Icon name="chevron-down" className="ui-icon select-wrap__chevron" />
      </div>
    </div>
  );
}
