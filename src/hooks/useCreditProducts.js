import { useEffect, useState } from 'react';

import { useDependencies } from './useDependencies.js';

/**
 * useCreditProducts — carga el catálogo completo de productos.
 *
 * Es el equivalente del `CatalogController` de la Actividad 1: invoca el caso
 * de uso, desenvuelve el `Result` y expone a la página un estado plano. La
 * página no sabe que existe un `Result` ni un repositorio.
 *
 * @returns {{ products: Array<Object>, total: number, isLoading: boolean, error: string|null }}
 */
export function useCreditProducts() {
  const { listCreditProducts, notifier } = useDependencies();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // `cancelled` evita escribir estado si el componente se desmonta antes de
    // que resuelva la promesa (React 18 monta dos veces en modo estricto).
    let cancelled = false;

    async function load() {
      const result = await listCreditProducts.execute();
      if (cancelled) return;

      if (result.isFailure) {
        setError(result.error);
        notifier.error(result.error);
        setIsLoading(false);
        return;
      }

      setProducts(result.value.products);
      setTotal(result.value.total);
      setError(null);
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [listCreditProducts, notifier]);

  return { products, total, isLoading, error };
}
