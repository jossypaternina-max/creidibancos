import { Link } from 'react-router-dom';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { Icon } from '../components/Icon.jsx';
import { Alert } from '../components/Alert.jsx';
import { ProductTile } from '../components/ProductTile.jsx';

/**
 * HomePage — página de la ruta `/`.
 *
 * Cuatro capas, en el orden en que se gana la confianza de quien llega:
 *
 *   1. Propuesta de valor y señales de que el proceso es serio.
 *   2. Accesos rápidos a los seis productos.
 *   3. Banda institucional con cifras comprobables.
 *
 * No consulta repositorios: recibe los productos ya mapeados a DTO del hook
 * `useCreditProducts`, que es quien invoca el caso de uso.
 *
 * Capa: PRESENTACIÓN (página).
 */

/** Señales de confianza del hero. Ninguna promete un plazo de respuesta. */
const PROOF_POINTS = Object.freeze([
  { icon: 'lock', label: 'Proceso', detail: '100% en línea' },
  { icon: 'clock', label: 'Simulación', detail: 'inmediata' },
  { icon: 'shield-check', label: 'Tu información', detail: 'protegida' },
]);

export function HomePage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.CATALOG]);
  const { products, total, isLoading, error } = useCreditProducts();

  /* Las cifras de la banda de confianza salen del catálogo real. No se
     publican datos de clientes ni de satisfacción: no existe una fuente que
     los respalde, y afirmarlos en un sitio financiero es exactamente lo que
     resta credibilidad. */
  const trustStats = [
    { icon: 'document', value: String(total || products.length), label: 'productos de crédito' },
    { icon: 'money', value: '100%', label: 'proceso digital' },
    { icon: 'clock', value: 'Inmediata', label: 'simulación de cuota' },
  ];

  return (
    <>
      <header className="hero">
        <div className="hero__inner container container--wide">
          <div className="hero__copy">
            <p className="hero__eyebrow">Créditos que te impulsan</p>

            <h1 className="hero__title">
              Haz realidad
              <br />
              <span className="hero__title-accent">tus planes</span>
            </h1>

            <p className="hero__subtitle">
              Compara, simula y solicita créditos de forma segura, clara y 100% en línea.
            </p>

            {/* Las señales de confianza van ANTES del botón, como en el
                diseño aprobado: primero se justifica por qué merece la pena y
                después se pide el clic. El orden del marcado es el mismo que
                el visual, así que la lectura con teclado y con lector de
                pantalla coincide con lo que se ve. */}
            <ul className="hero__proof">
              {PROOF_POINTS.map(({ icon, label, detail }) => (
                <li className="hero__proof-item" key={label}>
                  <span className="hero__proof-icon" aria-hidden="true">
                    <Icon name={icon} />
                  </span>
                  <span>
                    {label}
                    <br />
                    {detail}
                  </span>
                </li>
              ))}
            </ul>

            {/* Una sola llamada a la acción. El simulador sigue a un clic en
                la barra superior; dos botones del mismo peso repartían la
                atención justo donde conviene un único siguiente paso. */}
            <div className="hero__actions">
              <Link className="btn btn--primary btn--pill" to={ROUTES.PRODUCTS}>
                Explorar créditos
                <Icon name="arrow-right" className="ui-icon ui-icon--sm" />
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            {/* Fotografía local, servida en WebP con JPG de respaldo. Es la
                primera imagen de la página y la más grande, así que se carga
                con prioridad en vez de esperar al resto. No se invierte ni se
                duplica para el tema oscuro: una foto no tiene «versión
                nocturna», solo se atenúa (ver `--photo-dim`). */}
            <picture>
              <source srcSet="/assets/photos/hero-pareja.webp" type="image/webp" />
              <img
                src="/assets/photos/hero-pareja.jpg"
                alt="Una pareja revisa opciones de crédito en un portátil desde su sala"
                width="1600"
                height="900"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </picture>

            <div className="hero__floating-card">
              <span className="hero__floating-icon" aria-hidden="true">
                <Icon name="chart" />
              </span>
              <p className="hero__floating-title">Un mejor futuro está más cerca</p>
              <p className="hero__floating-text">
                Encuentra el crédito ideal para ti y da el siguiente paso.
              </p>
              <div className="hero__floating-bar" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      <section className="section section--compact home-products" aria-labelledby="productos-home">
        <div className="container container--wide">
        <div className="section__head">
          <h2 className="section__title" id="productos-home">
            Soluciones de crédito para cada etapa de tu vida
          </h2>

          <Link className="btn btn--ghost btn--sm" to={ROUTES.PRODUCTS}>
            Ver todos los productos
            <Icon name="arrow-right" className="ui-icon ui-icon--sm" />
          </Link>
        </div>

        {isLoading && (
          <Alert variant="empty" role="status">
            Cargando productos de crédito…
          </Alert>
        )}

        {error && (
          <Alert variant="error" icon="info" role="alert" title="No pudimos cargar la información">
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <div className="grid grid--strip">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
        </div>
      </section>

      <section className="trust-section" aria-labelledby="confianza-home">
        <div className="trust-strip">
          <div className="trust-strip__media">
            {/* Decorativa: el mensaje está en el texto que va encima, así que
                la imagen se oculta a los lectores de pantalla en vez de
                describir un paisaje que no aporta información. */}
            <picture>
              <source srcSet="/assets/photos/confianza-colombia.webp" type="image/webp" />
              <img
                src="/assets/photos/confianza-colombia.jpg"
                alt=""
                aria-hidden="true"
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>

          {/* El texto cuelga de la BANDA, no de la columna de la fotografía:
              su sangría se calcula contra el ancho completo para caer en la
              misma vertical que el resto de los encabezados de la página. */}
          <div className="trust-strip__copy">
            <h2 className="trust-strip__title" id="confianza-home">
              Creemos en tus planes
            </h2>
            <p className="trust-strip__text">
              Encuentra opciones claras para tomar una decisión informada y avanzar con
              confianza.
            </p>
            <Link className="btn btn--on-dark btn--pill" to={ROUTES.HELP}>
              Conoce más
            </Link>
          </div>

          <div className="trust-strip__stats">
            {trustStats.map(({ icon, value, label }) => (
              <div className="trust-stat" key={label}>
                <span className="trust-stat__icon" aria-hidden="true">
                  <Icon name={icon} className="ui-icon ui-icon--sm" />
                </span>
                <span>
                  <strong className="trust-stat__value">{value}</strong>
                  <span className="trust-stat__label">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
