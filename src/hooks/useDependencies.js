import { useContext } from 'react';
import { DependenciesContext } from '../context/DependenciesProvider.jsx';

/**
 * useDependencies — acceso a los casos de uso inyectados.
 *
 * Falla de forma explícita si se usa fuera del proveedor: un componente sin
 * dependencias es un error de composición, no un caso a degradar en silencio.
 *
 * @returns {Readonly<{
 *   listCreditProducts: Object, searchCreditProducts: Object,
 *   getAmountRangeFilters: Object, getCreditProductNames: Object,
 *   simulateCredit: Object, submitCreditApplication: Object,
 *   notifier: Object, termOptions: number[]
 * }>}
 */
export function useDependencies() {
  const services = useContext(DependenciesContext);

  if (!services) {
    throw new Error(
      'useDependencies() se ha llamado fuera de <DependenciesProvider>. ' +
        'Envuelve la aplicación en el proveedor desde main.jsx.',
    );
  }

  return services;
}
