/**
 * FormField — un campo del formulario de solicitud, con etiqueta y error.
 *
 * Sirve para los tres tipos que usa el formulario (`input`, `select` y
 * `textarea`) porque la única diferencia entre ellos es el control que se
 * pinta: la etiqueta, la marca de obligatorio y el hueco del mensaje de error
 * son iguales. Un componente por archivo, sin estado: el valor y el error
 * llegan por props.
 *
 * @param {{
 *   name: string,
 *   label: string,
 *   value: string,
 *   error?: string,
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

  const shared = {
    id,
    name,
    value,
    onChange: (event) => onChange(name, event.target.value),
    onBlur: () => onBlur?.(name),
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className={full ? 'field grid-form__full' : 'field'}>
      <label className="label" htmlFor={id}>
        {label}{' '}
        <span className="t-required" aria-hidden="true">
          *
        </span>
      </label>

      {type === 'select' && (
        <select {...shared} className={`control control--select ${error ? 'is-invalid' : ''}`}>
          <option value="">{placeholderOption}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {type === 'textarea' && (
        <textarea
          {...shared}
          className={`control control--textarea ${error ? 'is-invalid' : ''}`}
          rows={rows}
          placeholder={placeholder}
        />
      )}

      {type !== 'select' && type !== 'textarea' && (
        <input
          {...shared}
          type={type}
          className={`control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          min={min}
          autoComplete={autoComplete}
        />
      )}

      <span className="field__error" id={errorId} role="alert">
        {error}
      </span>
    </div>
  );
}
