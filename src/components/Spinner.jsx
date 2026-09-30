/**
 * Spinner — indicador de carga reutilizable.
 *
 * Envuelve el círculo giratorio (`.spinner`, definido en `03-base.css`) con una
 * etiqueta de texto y las semánticas de accesibilidad correctas. El giro es
 * decorativo (`aria-hidden`); lo que anuncia el lector de pantalla es la
 * etiqueta dentro de una región `aria-live`, para que "Cargando…" se escuche una
 * sola vez al aparecer y no en bucle.
 *
 * Se usa en todo estado de espera de una consulta a Firebase (catálogo,
 * búsqueda, solicitudes). Para el botón de envío existe `btn__spinner`, que vive
 * dentro del propio botón.
 *
 * @param {{ label?: string, role?: string }} props
 *   - `label`: texto visible junto al giro.
 *   - `role`: `status` (por defecto, no interrumpe) o el que convenga.
 *
 * Capa: PRESENTACIÓN (componente). Sin estado, sin efectos, sin casos de uso.
 */
export function Spinner({ label = 'Cargando…', role = 'status' }) {
  return (
    <div className="loading" role={role} aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      {label && <p className="loading__label t-muted">{label}</p>}
    </div>
  );
}
