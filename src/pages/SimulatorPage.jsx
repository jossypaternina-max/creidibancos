import { useMemo, useState } from 'react';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { useCreditSearch } from '../hooks/useCreditSearch.js';
import { useProductSorting } from '../hooks/useProductSorting.js';
import { useSimulation } from '../hooks/useSimulation.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Alert } from '../components/Alert.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { AmountRangeFilter } from '../components/AmountRangeFilter.jsx';
import { SortSelect } from '../components/SortSelect.jsx';
import { SimulatorForm } from '../components/SimulatorForm.jsx';
import { SimulationResult } from '../components/SimulationResult.jsx';
import { AmortizationTable } from '../components/AmortizationTable.jsx';
import { CreditCard } from '../components/CreditCard.jsx';

/**
 * SimulatorPage — página de la ruta `/simulador`.
 *
 * Dos bloques independientes:
 *
 *  1. El SIMULADOR: producto, monto y plazo → cuota mensual, coste total y
 *     tabla de amortización. La cuota se recalcula al cambiar cualquier valor.
 *  2. El CATÁLOGO: búsqueda mientras se escribe, filtro por rango de monto y
 *     ordenamiento.
 *
 * La página no calcula ni filtra: los cálculos vienen del dominio a través de
 * `useSimulation`, y el criterio de búsqueda, de `useCreditSearch`. Lo único
 * que decide aquí es el orden y qué tarjetas se muestran, que son decisiones
 * de interfaz.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function SimulatorPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.SIMULATOR]);

  /* Catálogo completo: alimenta el desplegable del simulador. */
  const { products: catalog } = useCreditProducts();

  const {
    form,
    selectedProduct,
    simulation,
    errors,
    isScheduleOpen,
    scheduleMode,
    selectProduct,
    setAmount,
    setTerm,
    reset,
    toggleSchedule,
    setScheduleMode,
  } = useSimulation(catalog);

  /* Catálogo filtrado por el dominio + orden y visibilidad decididos aquí. */
  const { query, setQuery, rangeIndex, setRangeIndex, ranges, products, matched, total, isFiltered, clearFilters } =
    useCreditSearch();

  const { sortBy, setSortBy, sortedProducts, options: sortOptions } = useProductSorting(products);

  const [hideSimulated, setHideSimulated] = useState(false);

  /* .filter() sobre los DTOs ya ordenados: no repetir la tarjeta del producto
     que se está simulando arriba es una decisión de presentación. */
  const visibleProducts = useMemo(
    () =>
      sortedProducts.filter(
        (product) => !hideSimulated || String(product.id) !== String(form.productId),
      ),
    [sortedProducts, hideSimulated, form.productId],
  );

  return (
    <div className="page">
      <Navbar />

      <main className="page__main container container--7xl section">
        <h1 className="section__title section__title--page">Simulador de Crédito</h1>
        <p className="section__subtitle">
          Calcula tu cuota mensual y consulta cuánto pagarías en total
        </p>

        <SimulatorForm
          catalog={catalog}
          form={form}
          bounds={selectedProduct}
          errors={errors}
          onSelectProduct={selectProduct}
          onAmountChange={setAmount}
          onTermChange={setTerm}
          onReset={reset}
        />

        {simulation ? (
          <>
            <SimulationResult simulation={simulation} />
            <AmortizationTable
              simulation={simulation}
              isOpen={isScheduleOpen}
              mode={scheduleMode}
              onToggle={toggleSchedule}
              onModeChange={setScheduleMode}
            />
          </>
        ) : (
          <Alert variant="empty" icon="🧮">
            Completa el monto y el plazo para ver tu cuota.
          </Alert>
        )}

        <hr className="sim-divider" />

        <h2 className="section__title section__title--sub">Catálogo de productos</h2>
        <p className="section__subtitle">
          Busca y filtra los productos disponibles según tus necesidades
        </p>

        <div className="panel panel--filters">
          <div className="filters__grid">
            <SearchBar value={query} onChange={setQuery} />
            <AmountRangeFilter ranges={ranges} value={rangeIndex} onChange={setRangeIndex} />
            <SortSelect options={sortOptions} value={sortBy} onChange={setSortBy} />
          </div>

          <div className="filters__actions">
            <label className="label" htmlFor="hide-simulated">
              <input
                id="hide-simulated"
                type="checkbox"
                checked={hideSimulated}
                onChange={(event) => setHideSimulated(event.target.checked)}
              />{' '}
              Ocultar el producto que estoy simulando
            </label>
            <button type="button" className="btn btn--outline" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>

        <Alert variant="info" icon="ℹ️">
          La búsqueda se aplica <strong>mientras escribes</strong>: el criterio lo resuelve el
          dominio, no la interfaz.
        </Alert>

        {isFiltered && (
          <p className="results-count">
            Mostrando <strong>{matched}</strong> de <strong>{total}</strong> productos
          </p>
        )}

        {visibleProducts.length === 0 ? (
          <Alert variant="empty" icon="🔎">
            Ningún producto coincide con los filtros aplicados.
          </Alert>
        ) : (
          <div className="grid-products">
            {visibleProducts.map((product) => (
              <CreditCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        )}
      </main>

      <Footer variant="compact" />
    </div>
  );
}
