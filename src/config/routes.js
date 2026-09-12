/**
 * routes.js — tabla de rutas de la aplicación.
 *
 *   /            → Home: propuesta de valor, accesos de producto y confianza
 *   /productos   → Catálogo con filtros, búsqueda y ordenamiento
 *   /simulador   → Simulador de cuota y tabla de amortización
 *   /solicitar   → Formulario de solicitud por pasos
 *   /ayuda       → Preguntas frecuentes
 *   *            → 404
 *
 * Las tres rutas originales conservan su path: ningún enlace externo o
 * marcador guardado deja de funcionar por el rediseño.
 *
 * Solo declara constantes. No importa páginas ni componentes, para que
 * cualquier módulo de presentación pueda leer las rutas sin crear
 * dependencias circulares: `Navbar` necesita conocer las rutas, y las páginas
 * necesitan a `Navbar`.
 *
 * Capa: CONFIGURACIÓN.
 */

/** @readonly */
export const ROUTES = Object.freeze({
  CATALOG: '/',
  PRODUCTS: '/productos',
  SIMULATOR: '/simulador',
  APPLICATION: '/solicitar',
  HELP: '/ayuda',
});

/**
 * Título del documento por ruta. Lo aplica el hook `useDocumentTitle`.
 *
 * @readonly
 */
export const ROUTE_TITLES = Object.freeze({
  [ROUTES.CATALOG]: 'CreditSmart — Créditos que te impulsan',
  [ROUTES.PRODUCTS]: 'CreditSmart — Productos de crédito',
  [ROUTES.SIMULATOR]: 'CreditSmart — Simulador de crédito',
  [ROUTES.APPLICATION]: 'CreditSmart — Solicitud de crédito',
  [ROUTES.HELP]: 'CreditSmart — Preguntas frecuentes',
});

/** Título de la ruta comodín. */
export const NOT_FOUND_TITLE = 'CreditSmart — Página no encontrada';

/**
 * Enlaces de la barra superior, en su orden de aparición. `cta` marca el
 * botón de llamada a la acción, que se pinta aparte de la navegación.
 *
 * @readonly
 */
export const NAV_ITEMS = Object.freeze([
  Object.freeze({ path: ROUTES.CATALOG, label: 'Inicio' }),
  Object.freeze({ path: ROUTES.PRODUCTS, label: 'Productos' }),
  Object.freeze({ path: ROUTES.SIMULATOR, label: 'Simulador' }),
  Object.freeze({ path: ROUTES.APPLICATION, label: 'Solicitar' }),
  Object.freeze({ path: ROUTES.HELP, label: 'Ayuda' }),
]);

/** Parámetros que el simulador traspasa al formulario de solicitud. */
export const PREFILL_PARAMS = Object.freeze({
  PRODUCT: 'product',
  AMOUNT: 'amount',
  TERM: 'term',
});
