/**
 * Logo — marca CreditSmart.
 *
 * El símbolo es el mismo de `public/assets/logo/creditsmart-mark.svg`, pero
 * inline y con los colores resueltos por tokens en lugar de hex fijos: así la
 * marca sigue al tema claro/oscuro sin necesitar dos archivos ni un `<picture>`.
 *
 * El nombre NO va dentro del SVG: se escribe como texto. Un texto real se lee,
 * se busca, se traduce y escala con la tipografía del sistema; un texto
 * convertido a trazos, no.
 *
 * @param {{ withName?: boolean, className?: string }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function Logo({ withName = true, className = '' }) {
  return (
    <span className={className ? `logo ${className}` : 'logo'}>
      <svg
        className="logo__mark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        role="img"
        aria-label={withName ? undefined : 'CreditSmart'}
        aria-hidden={withName ? 'true' : undefined}
        focusable="false"
      >
        <path fill="var(--growth)" d="M7 23C9 12 18 6 31 6c-1 7-5 13-12 17-5 3-9 3-12 0Z" />
        <path fill="var(--brand)" d="M9 31c4-6 10-9 18-9 7 0 11 4 14 9-6 8-15 12-24 9-4-1-7-4-8-9Z" />
        <path
          fill="none"
          stroke="var(--logo-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
          d="M12 30c6-2 12-6 18-13"
        />
      </svg>

      {withName && (
        <span className="logo__name">
          Credit<span className="logo__name-accent">Smart</span>
        </span>
      )}
    </span>
  );
}
