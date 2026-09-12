/**
 * productVisualMap.js — metadatos VISUALES de los productos de crédito.
 *
 * Qué pictograma y qué frase corta acompaña a cada producto es una decisión de
 * merchandising, no una regla financiera: cambiarla no cambia una tasa, un
 * plazo ni una validación. Por eso vive en presentación y NO en
 * `CreditProduct`, en `ProductTheme` ni en `creditsData.js`.
 *
 * Consecuencia práctica: el dominio nunca almacena una ruta de SVG ni un texto
 * publicitario. Si mañana el catálogo llega de una API, este mapa sigue
 * valiendo igual porque se apoya en el `id` del producto.
 *
 * `shortName` es el nombre sin el prefijo «Crédito», para los accesos
 * rápidos de la home: en una pieza de 2.5 rem de alto, repetir la palabra
 * «Crédito» seis veces ocupa el sitio de lo que de verdad distingue a cada
 * producto. El nombre completo del catálogo no se toca.
 *
 * El `tone` elige el par de tokens del chip del icono: `brand` (azul
 * corporativo) o `growth` (verde de progreso). No hay un tercer tono: la
 * regla de 2–3 colores se cumple aquí también.
 *
 * Este archivo NO importa nada, igual que `routes.js`.
 *
 * Capa: CONFIGURACIÓN de presentación.
 */

/** @typedef {{ iconKey: string, shortName: string, shortBenefit: string, tone: 'brand'|'growth' }} ProductVisual */

/** Metadatos por `id` de producto del catálogo. @type {Readonly<Record<string, ProductVisual>>} */
const BY_ID = Object.freeze({
  1: Object.freeze({
    iconKey: 'libre-inversion',
    shortName: 'Libre inversión',
    shortBenefit: 'Haz realidad lo que necesitas',
    tone: 'growth',
  }),
  2: Object.freeze({
    iconKey: 'vehiculo',
    shortName: 'Vehículo',
    shortBenefit: 'Tu próximo viaje comienza aquí',
    tone: 'brand',
  }),
  3: Object.freeze({
    iconKey: 'vivienda',
    shortName: 'Vivienda',
    shortBenefit: 'El hogar que siempre soñaste',
    tone: 'brand',
  }),
  4: Object.freeze({
    iconKey: 'educacion',
    shortName: 'Educación',
    shortBenefit: 'Invierte en tu futuro',
    tone: 'brand',
  }),
  5: Object.freeze({
    iconKey: 'negocio',
    shortName: 'Negocio',
    shortBenefit: 'Haz crecer tus ideas',
    tone: 'growth',
  }),
  6: Object.freeze({
    // El catálogo ofrece Libranza, no tarjeta de crédito: el pictograma es el
    // documento de la certificación laboral, que es lo que realmente pide el
    // producto. Mismo set de trazos, misma retícula.
    iconKey: 'document',
    shortName: 'Libranza',
    shortBenefit: 'Descuento directo de tu nómina',
    tone: 'brand',
  }),
});

/** Si un producto nuevo no está mapeado, se pinta con esto en vez de romper. */
const FALLBACK = Object.freeze({
  iconKey: 'money',
  shortName: '',
  shortBenefit: 'Encuentra la opción que se ajusta a ti',
  tone: 'brand',
});

/**
 * @param {string|number} productId
 * @returns {ProductVisual}
 */
export function visualForProduct(productId) {
  return BY_ID[String(productId)] ?? FALLBACK;
}
