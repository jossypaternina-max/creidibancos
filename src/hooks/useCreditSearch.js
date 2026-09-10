import { useCallback, useEffect, useState } from 'react';

import { useDependencies } from './useDependencies.js';

/** Índice del rango "Todos los montos": el filtro empieza sin acotar. */
const ALL_AMOUNTS = 0;

/**
 * useCreditSearch — búsqueda de productos con filtros.
 *
 * Hace el papel del `SimulatorController` de la Actividad 1 en su parte de
 * catálogo: guarda el estado de la interfaz (texto y rango elegidos), invoca
 * `SearchCreditProductsUseCase` cada vez que cambia y expone el resultado ya
 * desenvuelto.
 *
 * El filtrado NO se hace aquí: el criterio se resuelve en el dominio
 * (`ProductSearchCriteria`, `CreditProduct.matchesName()`,
 * `AmountRange.overlaps()`). Este hook solo traduce estado de UI a una llamada
 * al caso de uso, así que la regla de negocio sigue siendo la misma que
 * usaría un backend.
 *
 * Cada pulsación dispara la búsqueda: no hay botón obligatorio ni espera.
 *
 * @returns {{
 *   query: string, setQuery: (value: string) => void,
 *   rangeIndex: number, setRangeIndex: (index: number) => void,
 *   ranges: Array<{ index: number, label: string }>,
 *   products: Array<Object>, matched: number, total: number,
 *   isFiltered: boolean, isLoading: boolean, clearFilters: () => void
 * }}
 */
export function useCreditSearch() {
  const { searchCreditProducts, getAmountRangeFilters, notifier } = useDependencies();

  const [query, setQuery] = useState('');
  const [rangeIndex, setRangeIndex] = useState(ALL_AMOUNTS);
  const [ranges, setRanges] = useState([]);
  const [products, setProducts] = useState([]);
  const [matched, setMatched] = useState(0);
  const [total, setTotal] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* Opciones del desplegable de rangos: se piden una sola vez. */
  useEffect(() => {
    let cancelled = false;

    async function loadRanges() {
      const result = await getAmountRangeFilters.execute();
      if (cancelled) return;

      if (result.isFailure) {
        notifier.error(result.error);
        return;
      }
      setRanges(result.value);
    }

    loadRanges();

    return () => {
      cancelled = true;
    };
  }, [getAmountRangeFilters, notifier]);

  /* Búsqueda incremental: se relanza con cada cambio de texto o de rango. */
  useEffect(() => {
    let cancelled = false;

    async function search() {
      const result = await searchCreditProducts.execute({
        query,
        amountRangeIndex: rangeIndex,
      });
      if (cancelled) return;

      if (result.isFailure) {
        notifier.error(result.error);
        setIsLoading(false);
        return;
      }

      setProducts(result.value.products);
      setMatched(result.value.matched);
      setTotal(result.value.total);
      setIsFiltered(result.value.isFiltered);
      setIsLoading(false);
    }

    search();

    return () => {
      cancelled = true;
    };
  }, [query, rangeIndex, searchCreditProducts, notifier]);

  const clearFilters = useCallback(() => {
    setQuery('');
    setRangeIndex(ALL_AMOUNTS);
  }, []);

  return {
    query,
    setQuery,
    rangeIndex,
    setRangeIndex,
    ranges,
    products,
    matched,
    total,
    isFiltered,
    isLoading,
    clearFilters,
  };
}
