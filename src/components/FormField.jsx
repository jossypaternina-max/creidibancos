import { Icon } from './Icon.jsx';

/**
 * FormField — un campo del formulario de solicitud, con etiqueta y error.
 *
 * Sirve para los tres tipos que usa el formulario (`input`, `select` y
 * `textarea`) porque la única diferencia entre ellos es el control que se
 * pinta: la etiqueta, la marca de obligatorio y el hueco del mensaje de error
 * son iguales. Un componente por archivo, sin estado: el valor y el error
 * llegan por props.
 *
 * La etiqueta es siempre visible y nunca se sustituye por el `placeholder`:
 * el texto de ayuda desaparece en cuanto se escribe, y con él la única pista
 * de qué se estaba rellenando.
 *
 * El hueco del error está reservado con `min-height`, así que aparecer o
 * desaparecer no empuja el resto del formulario.
 *
 * @param {{
 *   name: string,
 *   label: string,
 *   value: string,
 *   error?: string,
 *   hint?: string,
 *   type?: string,
 *   placeholder?: string,
 *   options?: Array<{ value: string|number, label: string }>,
 *   placeholderOption?: string,
 *   rows?: number,
 *   min?: number,
 *   autoComplete?: string,
 *   full?: boolean,
 *   onChange: (name: string, value: string) => void,
 *   onBlur?: (name: string) => void
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function FormField({
  name,
  label,
  value,
  error = '',
  hint = '',
  type = 'text',
  placeholder = '',
  options = [],
  placeholderOption = '-- Seleccione --',
  rows = 3,
  min,
  autoComplete,
  full = false,
  onChange,
  onBlur,
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ');

  const shared = {
    id,
    name,
    value,
    className: 'field__control',
    onChange: (event) => onChange(name, event.target.value),
    onBlur: () => onBlur?.(name),
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy || undefined,
  };

  return (
    <div className={full ? 'field grid--form__full' : 'field'}>
      <label className="field__label" htmlFor={id}>
        {label}{' '}
        <span className="field__required" aria-hidden="true">
          *
        </span>
      </label>

      {type === 'select' && (
        <div className="select-wrap">
          <select {...shared}>
            <option value="">{placeholderOption}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" className="ui-icon select-wrap__chevron" />
        </div>
      )}

      {type === 'textarea' && (
        <textarea {...shared} rows={rows} placeholder={placeholder} />
      )}

      {type !== 'select' && type !== 'textarea' && (
        <input
          {...shared}
          type={type}
          placeholder={placeholder}
          min={min}
          autoComplete={autoComplete}
        />
      )}

      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}

      <p className="field__error" id={errorId} role="alert">
        {error}
      </p>
    </div>
  );
}
