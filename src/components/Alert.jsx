/**
 * Alert — banda informativa reutilizable.
 *
 * Sin icono por defecto: el color y el texto ya comunican el estado. Un
 * emoji decorativo en un aviso financiero resta formalidad.
 *
 * @param {{
 *   variant?: 'info'|'empty',
 *   icon?: string|null,
 *   role?: string,
 *   children: React.ReactNode
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function Alert({ variant = 'info', icon = null, role = 'status', children }) {
  return (
    <div className={`alert alert--${variant}`} role={role}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
