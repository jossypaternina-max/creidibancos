import { useEffect, useState } from 'react';

import { useDependencies } from './useDependencies.js';

/**
 * useMyApplications — carga las solicitudes de un correo desde Firestore.
 *
 * Invoca `ListMyApplicationsUseCase` (que consulta con `where` + `orderBy`),
 * desenvuelve el `Result` y expone a la página un estado plano con carga y
 * error. La página no sabe que existe un `Result`, un repositorio ni Firestore.
 *
 * Solo consulta cuando hay un correo no vacío: al abrir la página sin búsqueda,
 * no dispara ninguna lectura.
 *
 * @param {string} email Correo por el que filtrar (cadena vacía = sin consulta).
 * @returns {{ applications: Array<Object>, total: number, isLoading: boolean, error: string|null }}
 *
 * Capa: PRESENTACIÓN (hook).
 */
export function useMyApplications(email) {
  const { listMyApplications, notifier } = useDependencies();

  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const clean = String(email ?? '').trim();

    if (clean === '') {
      setApplications([]);
      setTotal(0);
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    // `cancelled` evita escribir estado si el componente se desmonta antes de
    // que resuelva la promesa (React monta dos veces en modo estricto).
    let cancelled = false;
    setIsLoading(true);

    async function load() {
      const result = await listMyApplications.execute({ email: clean });
      if (cancelled) return;

      if (result.isFailure) {
        setError(result.error);
        notifier.error(result.error);
        setApplications([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      setApplications(result.value.applications);
      setTotal(result.value.total);
      setError(null);
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [email, listMyApplications, notifier]);

  return { applications, total, isLoading, error };
}
