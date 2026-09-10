import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useCreditSearch } from '../hooks/useCreditSearch.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Alert } from '../components/Alert.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { AmountRangeFilter } from '../components/AmountRangeFilter.jsx';
import { CreditCard } from '../components/CreditCard.jsx';

/**
 * SimulatorPage — página de la ruta `/simulador`.
 *
 * Dos bloques independientes: el simulador de cuota (pendiente) y el buscador
 * del catálogo con filtros, que ya funciona.
 *
 * La página no filtra ni calcula: `useCreditSearch` invoca el caso de uso y el
 * criterio se resuelve en el dominio. Aquí solo se pinta el resultado.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function SimulatorPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.SIMULATOR]);

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

  return (
    <div className="page">
      <Navbar />

      <main className="page__main container container--7xl section">
        <h1 className="section__title section__title--page">Simulador de Crédito</h1>
        <p className="section__subtitle">
          Calcula tu cuota mensual y consulta cuánto pagarías en total
        </p>

        <hr className="sim-divider" />

        <h2 className="section__title section__title--sub">Catálogo de productos</h2>
        <p className="section__subtitle">
          Busca y filtra los productos disponibles según tus necesidades
        </p>

        <div className="panel panel--filters">
          <div className="filters__grid">
            <SearchBar value={query} onChange={setQuery} />
            <AmountRangeFilter ranges={ranges} value={rangeIndex} onChange={setRangeIndex} />
          </div>

          <div className="filters__actions">
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

        {products.length === 0 ? (
          <Alert variant="empty" icon="🔎">
            Ningún producto coincide con los filtros aplicados.
          </Alert>
        ) : (
          <div className="grid-products">
            {products.map((product) => (
              <CreditCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        )}
      </main>

      <Footer variant="compact" />
    </div>
  );
}
