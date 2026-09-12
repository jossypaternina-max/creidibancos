import { useCallback, useMemo, useState } from 'react';

/**
 * useCatalogRefinement — afinado del catálogo en la interfaz.
 *
 * Añade dos filtros que el mockup pide y que NO son reglas de negocio:
 *
 *  - por tipo de crédito: marcar qué productos quiere ver el usuario;
 *  - por plazo máximo: quedarse con los que no superan cierto número de meses.
 *
 * Son decisiones de presentación, del mismo orden que el ordenamiento: se
 * aplican sobre los DTOs que el dominio ya devolvió, sin volver a consultar el
 * catálogo y sin tocar `ProductSearchCriteria`. El filtrado con criterio de
 * negocio —texto y rango de monto— sigue resolviéndose en el dominio a través
 * de `useCreditSearch`.
 *
 * Ninguna de las dos listas de opciones está escrita a mano: ambas se derivan
 * del catálogo recibido, así que añadir un producto nuevo las actualiza solo.
 *
 * @param {Array<Object>} catalog Catálogo completo, para derivar las opciones.
 * @param {Array<Object>} products Productos ya filtrados por el dominio.
 *
 * Capa: PRESENTACIÓN (hook).
 */

/** Valor del desplegable de plazo que no acota nada. */
const ANY_TERM = '';

export function useCatalogRefinement(catalog, products) {
  /** Ids seleccionados. Vacío = «Todos», que es el estado inicial. */
  const [selectedIds, setSelectedIds] = useState([]);
  const [maxTerm, setMaxTerm] = useState(ANY_TERM);

  /** Opciones de tipo de crédito, en el orden del catálogo. */
  const typeOptions = useMemo(
    () => catalog.map((product) => ({ id: String(product.id), label: product.name })),
    [catalog],
  );

  /** Plazos ofrecidos, sin repetir y de menor a mayor. */
  const termOptions = useMemo(() => {
    const months = [...new Set(catalog.map((product) => product.maxTermMonths))];
    months.sort((a, b) => a - b);

    return [
      { value: ANY_TERM, label: 'Todos' },
      ...months.map((value) => ({ value: String(value), label: `Hasta ${value} meses` })),
    ];
  }, [catalog]);

  const refinedProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesType =
        selectedIds.length === 0 || selectedIds.includes(String(product.id));

      const matchesTerm = maxTerm === ANY_TERM || product.maxTermMonths <= Number(maxTerm);

      return matchesType && matchesTerm;
    });
  }, [products, selectedIds, maxTerm]);

  /** Marca o desmarca un tipo concreto. */
  const toggleType = useCallback((id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }, []);

  /** «Todos» no es un tipo más: es no tener ninguno marcado. */
  const selectAllTypes = useCallback(() => setSelectedIds([]), []);

  const clearRefinement = useCallback(() => {
    setSelectedIds([]);
    setMaxTerm(ANY_TERM);
  }, []);

  const isRefined = selectedIds.length > 0 || maxTerm !== ANY_TERM;

  return {
    typeOptions,
    selectedIds,
    toggleType,
    selectAllTypes,
    termOptions,
    maxTerm,
    setMaxTerm,
    refinedProducts,
    isRefined,
    clearRefinement,
  };
}
