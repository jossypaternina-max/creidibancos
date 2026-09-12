import { useMemo } from 'react';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { useCreditSearch } from '../hooks/useCreditSearch.js';
import { useCatalogRefinement } from '../hooks/useCatalogRefinement.js';
import { useProductSorting } from '../hooks/useProductSorting.js';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { CatalogFilters } from '../components/CatalogFilters.jsx';
import { CreditCard } from '../components/CreditCard.jsx';
import { Alert } from '../components/Alert.jsx';

/**
 * ProductsPage — página de la ruta `/productos`.
 *
 * Catálogo completo con panel de filtros a la izquierda y rejilla de
 * resultados a la derecha. Es la pantalla de exploración: la home lleva aquí
 * y desde aquí se salta al simulador o a la solicitud.
 *
 * La página no filtra ni ordena por su cuenta. Encadena tres capas y cada
 * una hace lo suyo:
 *
 *   1. `useCreditSearch`   → texto y rango de monto, resueltos por el DOMINIO.
 *   2. `useCatalogRefinement` → tipo y plazo, decisiones de INTERFAZ.
 *   3. `useProductSorting` → orden, decisión de INTERFAZ.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function ProductsPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.PRODUCTS]);

  /* Catálogo completo: de él se derivan las opciones de los filtros, que así
     nunca se desincronizan de los productos existentes. */
  const { products: catalog, total, isLoading: isCatalogLoading, error } = useCreditProducts();

  const {
    query,
    setQuery,
    rangeIndex,
    setRangeIndex,
    ranges,
    products,
    isLoading: isSearching,
    clearFilters,
  } = useCreditSearch();

  const {
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
  } = useCatalogRefinement(catalog, products);

  const { sortBy, setSortBy, sortedProducts, options: sortOptions } =
    useProductSorting(refinedProducts);

  const isLoading = isCatalogLoading || isSearching;
  const hasFilters = query !== '' || rangeIndex !== 0 || isRefined;
  const shown = sortedProducts.length;

  /* Distintivo de la tarjeta. El mockup muestra «Más solicitado», pero no
     existe ningún dato de demanda que lo respalde: afirmarlo sería inventar
     una estadística en una web financiera. Se sustituye por un hecho que SÍ
     está en el catálogo y que además es lo que el usuario compara: cuál es
     el producto con la tasa más baja. */
  const cheapestId = useMemo(() => {
    if (catalog.length === 0) return null;
    return catalog.reduce((best, item) => (item.annualRate < best.annualRate ? item : best)).id;
  }, [catalog]);

  function clearAll() {
    clearFilters();
    clearRefinement();
  }

  return (
    <div className="container container--wide">
      <Breadcrumb items={[{ label: 'Inicio', to: ROUTES.CATALOG }, { label: 'Productos' }]} />

      <section className="section section--compact" aria-labelledby="productos-titulo">
        <div className="split split--sidebar">
          <CatalogFilters
            query={query}
            onQueryChange={setQuery}
            typeOptions={typeOptions}
            selectedIds={selectedIds}
            onToggleType={toggleType}
            onSelectAllTypes={selectAllTypes}
            ranges={ranges}
            rangeIndex={rangeIndex}
            onRangeChange={setRangeIndex}
            termOptions={termOptions}
            maxTerm={maxTerm}
            onMaxTermChange={setMaxTerm}
            sortOptions={sortOptions}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClear={clearAll}
            canClear={hasFilters}
          />

          <div>
            <div className="results-head">
              <div>
                <h1 className="section__title" id="productos-titulo">
                  Nuestros productos
                </h1>
                <p className="section__subtitle">
                  Encuentra el crédito que mejor se adapta a tus necesidades.
                </p>
              </div>

              <p className="results-count" role="status">
                {hasFilters ? (
                  <>
                    <strong>{shown}</strong> de <strong>{total}</strong> productos
                  </>
                ) : (
                  <>
                    <strong>{total}</strong> productos
                  </>
                )}
              </p>
            </div>

            {isLoading && (
              <Alert variant="empty" role="status">
                Cargando productos de crédito…
              </Alert>
            )}

            {error && (
              <Alert
                variant="error"
                role="alert"
                title="No pudimos cargar la información"
              >
                {error}
              </Alert>
            )}

            {!isLoading && !error && shown === 0 && (
              <Alert
                variant="empty"
                title="No encontramos productos con esos filtros"
                action={
                  <button type="button" className="btn btn--outline" onClick={clearAll}>
                    Limpiar filtros
                  </button>
                }
              >
                Prueba con otro monto, plazo o término de búsqueda.
              </Alert>
            )}

            {!isLoading && !error && shown > 0 && (
              <div className="grid grid--cards">
                {sortedProducts.map((product) => (
                  <CreditCard
                    key={product.id}
                    product={product}
                    variant="full"
                    badge={String(product.id) === String(cheapestId) ? 'Menor tasa' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
