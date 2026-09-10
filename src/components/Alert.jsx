/**
 * Alert — banda informativa reutilizable.
 *
 * @param {{
 *   variant?: 'info'|'empty',
 *   icon?: string,
 *   role?: string,
 *   children: React.ReactNode
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function Alert({ variant = 'info', icon = 'ℹ️', role = 'status', children }) {
  return (
    <div className={`alert alert--${variant}`} role={role}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
