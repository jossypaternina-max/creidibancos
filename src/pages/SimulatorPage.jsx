import { useMemo, useState } from 'react';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useDependencies } from '../hooks/useDependencies.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { useCreditSearch } from '../hooks/useCreditSearch.js';
import { useProductSorting } from '../hooks/useProductSorting.js';
import { useSimulation } from '../hooks/useSimulation.js';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Alert } from '../components/Alert.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { AmountRangeFilter } from '../components/AmountRangeFilter.jsx';
import { SortSelect } from '../components/SortSelect.jsx';
import { SimulatorForm } from '../components/SimulatorForm.jsx';
import { SimulationResult } from '../components/SimulationResult.jsx';
import { AmortizationTable } from '../components/AmortizationTable.jsx';
import { GoalPanel } from '../components/GoalPanel.jsx';
import { CreditCard } from '../components/CreditCard.jsx';

/**
 * SimulatorPage — página de la ruta `/simulador`.
 *
 * Espacio de trabajo de decisión, en tres zonas que siguen el orden en que
 * se decide: ajusto a la izquierda, veo la cifra en el centro, me convenzo a
 * la derecha. Debajo, la tabla de amortización y las alternativas.
 *
 * El segundo catálogo no desaparece: cambia de propósito. Ya no es «otro
 * catálogo» sino «explora alternativas sin perder tu simulación actual»,
 * que es lo que realmente hace —la simulación de arriba sigue intacta
 * mientras se filtra abajo.
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

  const { termOptions } = useDependencies();

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
  const {
    query,
    setQuery,
    rangeIndex,
    setRangeIndex,
    ranges,
    products,
    matched,
    total,
    isFiltered,
    clearFilters,
  } = useCreditSearch();

  const { sortBy, setSortBy, sortedProducts, options: sortOptions } = useProductSorting(products);

  const [hideSimulated, setHideSimulated] = useState(true);

  /* No repetir la tarjeta del producto que se está simulando arriba es una
     decisión de presentación: el dato no cambia, solo deja de pintarse. */
  const visibleProducts = useMemo(
    () =>
      sortedProducts.filter(
        (product) => !hideSimulated || String(product.id) !== String(form.productId),
      ),
    [sortedProducts, hideSimulated, form.productId],
  );

  return (
    <div className="container container--wide">
      <Breadcrumb items={[{ label: 'Inicio', to: ROUTES.CATALOG }, { label: 'Simulador' }]} />

      <section className="section section--compact" aria-labelledby="simulador-titulo">
        <h1 className="sr-only" id="simulador-titulo">
          Simulador de crédito
        </h1>

        <div className="simulator-workspace">
          <SimulatorForm
            catalog={catalog}
            form={form}
            bounds={selectedProduct}
            errors={errors}
            termOptions={termOptions}
            onSelectProduct={selectProduct}
            onAmountChange={setAmount}
            onTermChange={setTerm}
            onReset={reset}
          />

          {simulation ? (
            <SimulationResult simulation={simulation} />
          ) : (
            <Alert variant="empty" title="Aún no hay resultado" role="status">
              Ingresa un monto y un plazo válidos para ver la estimación.
            </Alert>
          )}

          <GoalPanel />
        </div>

        {simulation && (
          <div className="sim-schedule-wrap">
            <AmortizationTable
              simulation={simulation}
              isOpen={isScheduleOpen}
              mode={scheduleMode}
              onToggle={toggleSchedule}
              onModeChange={setScheduleMode}
            />
          </div>
        )}
      </section>

      <hr className="divider" />

      <section className="section section--compact" aria-labelledby="alternativas-titulo">
        <div className="section__head">
          <div>
            <h2 className="section__title" id="alternativas-titulo">
              Explora alternativas
            </h2>
            <p className="section__subtitle">
              Compara otras opciones sin perder tu simulación actual.
            </p>
          </div>

          {isFiltered && (
            <p className="results-count" role="status">
              <strong>{matched}</strong> de <strong>{total}</strong> productos
            </p>
          )}
        </div>

        <div className="filters" data-print="hide">
          <div className="grid grid--form">
            <SearchBar value={query} onChange={setQuery} hideLabel={false} />

            <AmountRangeFilter
              ranges={ranges}
              value={rangeIndex}
              onChange={setRangeIndex}
              id="alt-range"
            />

            <SortSelect
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              id="alt-sort"
            />
          </div>

          <div className="cluster cluster--between">
            <label className="checkbox" htmlFor="hide-simulated">
              <input
                id="hide-simulated"
                type="checkbox"
                checked={hideSimulated}
                onChange={(event) => setHideSimulated(event.target.checked)}
              />
              Ocultar el producto que estoy simulando
            </label>

            <button type="button" className="btn btn--ghost" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <Alert
            variant="empty"
            title="No encontramos productos con esos filtros"
            action={
              <button type="button" className="btn btn--outline" onClick={clearFilters}>
                Limpiar filtros
              </button>
            }
          >
            Prueba con otro monto o término de búsqueda.
          </Alert>
        ) : (
          <div className="grid grid--cards">
            {visibleProducts.map((product) => (
              <CreditCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
