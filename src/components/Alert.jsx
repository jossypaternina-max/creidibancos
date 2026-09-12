import { Icon } from './Icon.jsx';

/**
 * Alert — banda de estado reutilizable.
 *
 * Cuatro variantes: `info`, `success`, `error` y `empty`. El color nunca va
 * solo: cada variante lleva icono y texto, porque un mensaje que solo se
 * distingue por el rojo no llega a quien no distingue el rojo.
 *
 * El `role` se elige desde fuera a propósito: un error de envío interrumpe
 * (`alert`), un contador de resultados no (`status`), y un estado vacío no
 * necesita anunciarse.
 *
 * @param {{
 *   variant?: 'info'|'success'|'error'|'empty',
 *   title?: string,
 *   icon?: string|null,
 *   role?: string,
 *   action?: React.ReactNode,
 *   children?: React.ReactNode
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */

/** Icono por defecto de cada variante. `empty` no lleva. */
const DEFAULT_ICON = Object.freeze({
  info: 'info',
  success: 'check-circle',
  error: 'info',
  empty: null,
});

export function Alert({
  variant = 'info',
  title,
  icon,
  role = 'status',
  action = null,
  children,
}) {
  const iconName = icon === null ? null : (icon ?? DEFAULT_ICON[variant]);
  const isEmpty = variant === 'empty';

  return (
    <div className={`alert alert--${variant}`} role={role}>
      {!isEmpty && iconName && (
        <Icon name={iconName} className="ui-icon alert__icon" />
      )}

      <div>
        {title && <p className="alert__title">{title}</p>}
        {children && <p className="alert__text">{children}</p>}
        {action}
      </div>
    </div>
  );
}
