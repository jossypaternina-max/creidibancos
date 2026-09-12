/**
 * Icon — set «CreditSmart Line 24», inline y monocromo.
 *
 * Los mismos trazos que viven en `public/assets/icons/`, pero embebidos como
 * SVG inline en lugar de servirse con `<img>`. Dos razones:
 *
 *  1. `currentColor`: un `<img>` es un documento aparte y no hereda el color
 *     del contenedor, así que el icono no podría teñirse con el token de la
 *     tarjeta, del botón o del panel. Inline sí.
 *  2. Una sola respuesta HTTP en vez de treinta y seis.
 *
 * Todos los trazos comparten viewBox 24×24, `stroke-width` 1.8 y remates
 * redondos: es lo que hace que el set se lea como un único sistema.
 *
 * Capa: PRESENTACIÓN (componente).
 */

/** Trazos de interfaz. Clave → contenido del `<svg>`. */
const UI_PATHS = Object.freeze({
  'arrow-right': <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
  building: (
    <>
      <path d="M5 21V5l7-2v18" />
      <path d="M12 8h7v13" />
      <path d="M3 21h18" />
      <path d="M8 8h1M8 12h1M8 16h1M15 11h1M15 15h1" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 9h16" />
    </>
  ),
  chart: <><path d="M4 20V10h4v10M10 20V5h4v15M16 20v-7h4v7M3 20h18" /></>,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  'chevron-down': <><path d="m7 9 5 5 5-5" /></>,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  compare: (
    <>
      <path d="M7 7h13" />
      <path d="m16 3 4 4-4 4" />
      <path d="M17 17H4" />
      <path d="m8 13-4 4 4 4" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 20h14" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  filter: <><path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" /></>,
  handshake: (
    <>
      <path d="m8 11 3-3c1-1 2-1 3 0l1 1" />
      <path d="m3 10 4-4 4 3M21 10l-4-4-3 2" />
      <path d="m7 14 4 4c.8.8 2 .8 2.8 0l4.2-4.2" />
      <path d="m9 16-2 2M11 18l-1 1" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </>
  ),
  leaf: (
    <>
      <path d="M19 4C10 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 9-16Z" />
      <path d="M6 18c3-4 6-6 11-9" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  money: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 9h.01M17 15h.01" />
    </>
  ),
  moon: <><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" /></>,
  phone: (
    <>
      <path d="M8 4 5.5 5.5c-.7.7-.6 2 .2 3.5 1.4 2.7 4.6 5.9 7.3 7.3 1.5.8 2.8.9 3.5.2L18 14l-3-2-1.6 1.6a13 13 0 0 1-3-3L12 9 10 6 8 4Z" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V4h10v4" />
      <path d="M6 17H4V9h16v8h-2" />
      <rect x="7" y="14" width="10" height="6" />
      <path d="M16.5 11h.01" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.2 8A7 7 0 0 1 18 6l2 1M18 16a7 7 0 0 1-11.8 2L4 17" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" />
    </>
  ),
});

/** Trazos de producto. Uno por cada familia del catálogo. */
const PRODUCT_PATHS = Object.freeze({
  educacion: (
    <>
      <path d="m3 9 9-4 9 4-9 4-9-4Z" />
      <path d="M6 11.5v4.2c3.9 2.7 8.1 2.7 12 0v-4.2" />
      <path d="M21 9v6" />
    </>
  ),
  'libre-inversion': (
    <>
      <rect x="5" y="7" width="14" height="11" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M8 12h8" />
      <path d="M12 9.5v5" />
    </>
  ),
  negocio: (
    <>
      <path d="M5 20V11h3v9" />
      <path d="M10.5 20V6h3v14" />
      <path d="M16 20V3h3v17" />
      <path d="M3 20h18" />
    </>
  ),
  'tarjeta-credito': (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <path d="M7 15h4" />
      <path d="M15.5 14.5h2" />
    </>
  ),
  vehiculo: (
    <>
      <path d="M5 16v1.5A1.5 1.5 0 0 0 6.5 19h.5A1.5 1.5 0 0 0 8.5 17.5V17h7v.5A1.5 1.5 0 0 0 17 19h.5a1.5 1.5 0 0 0 1.5-1.5V16" />
      <path d="M4 14.5V12l1.8-5h12.4l1.8 5v2.5A2.5 2.5 0 0 1 17.5 17h-11A2.5 2.5 0 0 1 4 14.5Z" />
      <path d="M6 12h12" />
      <circle cx="7.5" cy="14" r=".8" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="14" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  vivienda: (
    <>
      <path d="m3.5 10 8.5-6.5L20.5 10" />
      <path d="M5.5 9v10h13V9" />
      <path d="M9.5 19v-6h5v6" />
    </>
  ),
});

const ALL_PATHS = Object.freeze({ ...UI_PATHS, ...PRODUCT_PATHS });

/**
 * @param {{
 *   name: keyof typeof ALL_PATHS,
 *   size?: number|string,
 *   className?: string,
 *   title?: string
 * }} props
 */
export function Icon({ name, size = 24, className = 'ui-icon', title }) {
  const paths = ALL_PATHS[name];

  // Un nombre inexistente no debe romper la página: no se pinta nada.
  if (!paths) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      focusable="false"
    >
      {paths}
    </svg>
  );
}

/** Nombres válidos, por si alguna vista necesita recorrerlos. */
export const ICON_NAMES = Object.freeze(Object.keys(ALL_PATHS));
