/**
 * StaticCreditProductDataSource — FUENTE DE DATOS (detalle de infraestructura).
 *
 * Adaptador de lectura del catálogo. Los datos viven en `src/data/creditsData.js`
 * (dato puro, sin dependencias); este módulo es la puerta por la que la
 * infraestructura los consume, y el único punto que hay que sustituir para
 * pasar de datos estáticos a una API real: bastaría reemplazar estas
 * reexportaciones por peticiones HTTP sin tocar ninguna otra capa.
 *
 * Mantiene los nombres `STATIC_*` para que los repositorios y el contenedor de
 * dependencias sigan viendo la misma interfaz que en la Actividad 1.
 *
 * Capa: INFRAESTRUCTURA (datasource).
 */
import { CREDITS_DATA, AMOUNT_RANGES, TERM_OPTIONS } from '../../../data/creditsData.js';

/** Catálogo de productos de crédito en formato crudo. */
export const STATIC_CREDIT_PRODUCTS = CREDITS_DATA;

/** Rangos de monto del filtro del simulador. `max: null` = sin límite superior. */
export const STATIC_AMOUNT_RANGES = AMOUNT_RANGES;

/** Plazos ofrecidos en el `<select>` del formulario de solicitud. */
export const STATIC_TERM_OPTIONS = TERM_OPTIONS;
