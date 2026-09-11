import { Link } from 'react-router-dom';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { CreditCard } from '../components/CreditCard.jsx';

/**
 * CatalogPage — página de la ruta `/`.
 *
 * Réplica de la página principal de la Actividad 1:
 *   navbar · hero azul · "Nuestros Productos" · grid de tarjetas · footer.
 *
 * No consulta repositorios: recibe los productos ya mapeados a DTO del hook
 * `useCreditProducts`, que es quien invoca el caso de uso.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function CatalogPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.CATALOG]);
  const { products, isLoading, error } = useCreditProducts();

  return (
    <div className="page">
      <Navbar />

      <header className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">
            Tu crédito ideal,
            <br />
            <span className="hero__title-accent">en un solo lugar</span>
          </h1>
          <p className="hero__subtitle">
            Consulta, simula y solicita créditos de forma rápida, segura y 100% en línea.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--accent" to={ROUTES.SIMULATOR}>
              Simular Crédito
            </Link>
            <Link className="btn btn--ghost-light" to={ROUTES.APPLICATION}>
              Solicitar Ahora
            </Link>
          </div>
        </div>
      </header>

      <main className="page__main container container--7xl section section--catalog">
        <h2 className="section__title">Nuestros Productos</h2>
        <p className="section__subtitle">
          Elige el crédito que mejor se adapta a tus necesidades
        </p>

        {isLoading && (
          <div className="alert alert--empty" role="status">
            <span>Cargando el catálogo de productos…</span>
          </div>
        )}

        {error && (
          <div className="alert alert--empty" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="grid-products">
          {products.map((product) => (
            <CreditCard key={product.id} product={product} variant="full" />
          ))}
        </div>
      </main>

      <Footer variant="catalog" />
    </div>
  );
}
