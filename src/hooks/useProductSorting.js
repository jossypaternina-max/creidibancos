import { useMemo, useState } from 'react';

/**
 * useProductSorting — ordenamiento del catálogo en la interfaz.
 *
 * El orden de presentación no es una regla de negocio: se aplica sobre los
 * DTOs ya devueltos por el caso de uso, sin volver a consultar el catálogo.
 *
 * Los DTOs vienen congelados desde la capa de aplicación, así que se ordena
 * sobre una copia: `.sort()` muta el array que recibe.
 *
 * Capa: PRESENTACIÓN (hook).
 */

/** Opciones del desplegable, con su comparador. */
const COMPARATORS = Object.freeze({
  name: (a, b) => a.name.localeCompare(b.name, 'es'),
  rateAsc: (a, b) => a.annualRate - b.annualRate,
  rateDesc: (a, b) => b.annualRate - a.annualRate,
  amountDesc: (a, b) => (b.maxAmount ?? Infinity) - (a.maxAmount ?? Infinity),
  termDesc: (a, b) => b.maxTermMonths - a.maxTermMonths,
});

/** @type {ReadonlyArray<{ value: string, label: string }>} */
export const SORT_OPTIONS = Object.freeze([
  { value: 'name', label: 'Nombre (A–Z)' },
  { value: 'rateAsc', label: 'Tasa más baja' },
  { value: 'rateDesc', label: 'Tasa más alta' },
  { value: 'amountDesc', label: 'Monto máximo' },
  { value: 'termDesc', label: 'Plazo más largo' },
]);

/**
 * @param {Array<Object>} products Productos ya filtrados por el dominio.
 * @returns {{
 *   sortBy: string,
 *   setSortBy: (value: string) => void,
 *   sortedProducts: Array<Object>,
 *   options: ReadonlyArray<{ value: string, label: string }>
 * }}
 */
export function useProductSorting(products) {
  const [sortBy, setSortBy] = useState('name');

  const sortedProducts = useMemo(
    () => [...products].sort(COMPARATORS[sortBy] ?? COMPARATORS.name),
    [products, sortBy],
  );

  return { sortBy, setSortBy, sortedProducts, options: SORT_OPTIONS };
}
