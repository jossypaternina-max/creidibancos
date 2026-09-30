import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useMyApplications } from '../hooks/useMyApplications.js';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Spinner.jsx';

/**
 * MyApplicationsPage — página de la ruta `/mis-solicitudes`.
 *
 * Consulta en Firestore las solicitudes registradas con un correo (consulta
 * `where` + `orderBy`) y las lista de la más reciente a la más antigua. Cubre
 * los cuatro estados de una lectura remota: en blanco (aún sin buscar),
 * cargando, error de red y sin resultados.
 *
 * La página no consulta datos por su cuenta: lo hace a través de
 * `useMyApplications`, que invoca el caso de uso y desenvuelve el `Result`.
 * Aquí solo se decide qué se muestra.
 *
 * Si se llega desde la confirmación de una solicitud (`?email=`), la búsqueda
 * arranca ya resuelta con ese correo.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function MyApplicationsPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.MY_APPLICATIONS]);

  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';

  // `email` es lo que el usuario teclea; `queryEmail` es lo que se consulta.
  // Separarlos evita disparar una lectura por cada tecla.
  const [email, setEmail] = useState(initialEmail);
  const [queryEmail, setQueryEmail] = useState(initialEmail);

  const { applications, total, isLoading, error } = useMyApplications(queryEmail);

  function handleSubmit(event) {
    event.preventDefault();
    setQueryEmail(email.trim());
  }

  const hasSearched = queryEmail.trim() !== '';

  return (
    <div className="container container--wide">
      <Breadcrumb
        items={[{ label: 'Inicio', to: ROUTES.CATALOG }, { label: 'Mis solicitudes' }]}
      />

      <section className="section section--compact" aria-labelledby="mis-solicitudes-titulo">
        <h1 className="section__title" id="mis-solicitudes-titulo">
          Mis solicitudes
        </h1>
        <p className="section__subtitle">
          Escribe el correo con el que registraste tus solicitudes para consultarlas.
        </p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="grid grid--form">
            <div className="field grid--form__full">
              <label className="field__label" htmlFor="search-email">
                Correo electrónico
              </label>
              <input
                id="search-email"
                name="email"
                type="email"
                className="field__control"
                placeholder="Ej: juan@correo.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="form__nav">
            <button type="submit" className="btn btn--primary" disabled={isLoading}>
              {isLoading ? 'Consultando…' : 'Consultar solicitudes'}
            </button>
          </div>
        </form>

        <div className="section section--tight" aria-live="polite">
          {isLoading && <Spinner label="Cargando tus solicitudes desde la nube…" />}

          {!isLoading && error && (
            <Alert variant="error" role="alert" title="No se pudieron cargar tus solicitudes">
              {error}
            </Alert>
          )}

          {!isLoading && !error && hasSearched && total === 0 && (
            <Alert variant="empty" title="Sin solicitudes">
              No encontramos solicitudes registradas con ese correo.
            </Alert>
          )}

          {!isLoading && !error && total > 0 && (
            <>
              <p className="t-muted" role="status">
                {total === 1 ? '1 solicitud encontrada' : `${total} solicitudes encontradas`}
              </p>

              <div className="sim-schedule__scroll">
                <table className="sim-table">
                  <caption>Solicitudes de {queryEmail}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Radicado</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Monto</th>
                      <th scope="col">Plazo</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <th scope="row">{application.reference}</th>
                        <td>{formatDate(application.createdAt)}</td>
                        <td>{application.productName}</td>
                        <td>{application.amountLabel}</td>
                        <td>{application.termLabel}</td>
                        <td>{application.statusLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Fecha legible en español. El DTO trae la fecha en ISO; darle formato es una
 * decisión de presentación, no de dominio.
 *
 * @param {string} iso
 * @returns {string}
 */
function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}
