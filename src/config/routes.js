/**
 * routes.js — tabla de rutas de la aplicación.
 *
 * Mismas rutas que en la Actividad 1:
 *   /            → Catálogo
 *   /simulador   → Simulador
 *   /solicitar   → Solicitar
 *   *            → 404
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
  SIMULATOR: '/simulador',
  APPLICATION: '/solicitar',
});

/**
 * Título del documento por ruta. Lo aplica el hook `useDocumentTitle`, que
 * sustituye al decorador `DocumentTitleController` de la Actividad 1.
 *
 * @readonly
 */
export const ROUTE_TITLES = Object.freeze({
  [ROUTES.CATALOG]: 'CreditSmart — Catálogo',
  [ROUTES.SIMULATOR]: 'CreditSmart — Simulador',
  [ROUTES.APPLICATION]: 'CreditSmart — Solicitar',
});

/** Título de la ruta comodín. */
export const NOT_FOUND_TITLE = 'CreditSmart — Página no encontrada';
