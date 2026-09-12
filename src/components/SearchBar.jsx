import { Icon } from './Icon.jsx';

/**
 * SearchBar — campo de búsqueda por nombre de producto.
 *
 * Entrada controlada: el valor lo manda el estado de la página y cada
 * pulsación se notifica con `onChange`. Al no guardar estado propio, la
 * búsqueda se aplica mientras el usuario escribe sin pulsar ningún botón.
 *
 * La etiqueta existe siempre; lo que cambia es si se ve. Nunca se sustituye
 * por el `placeholder`: el texto de ayuda desaparece al escribir y deja al
 * campo sin nombre para un lector de pantalla.
 *
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   id?: string,
 *   label?: string,
 *   placeholder?: string,
 *   hideLabel?: boolean
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function SearchBar({
  value,
  onChange,
  id = 'filter-query',
  label = 'Buscar producto',
  placeholder = 'Buscar producto…',
  hideLabel = true,
}) {
  return (
    <div>
      <label className={hideLabel ? 'sr-only' : 'field__label'} htmlFor={id}>
        {label}
      </label>

      <div className="search-bar">
        <Icon name="search" className="ui-icon search-bar__icon" />
        <input
          id={id}
          name="query"
          type="search"
          className="search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
