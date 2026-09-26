import { createContext, useMemo } from 'react';

/**
 * DependenciesProvider — INYECCIÓN DE DEPENDENCIAS EN REACT.
 *
 * Equivalente en React de lo que hacían los controladores de la Actividad 1:
 * recibir el grafo ya construido y ponerlo al alcance de la interfaz. El
 * contenedor se construye una sola vez en `main.jsx` (Composition Root) y este
 * proveedor lo traduce a un objeto CONGELADO de casos de uso.
 *
 * Detalle importante: los componentes nunca reciben el `Container`, solo los
 * casos de uso ya resueltos. Así no pueden pedir un repositorio ni un
 * adaptador, y la regla "la presentación no importa infraestructura" se
 * mantiene sin depender de la disciplina de quien escribe la vista.
 *
 * Capa: PRESENTACIÓN (contexto).
 */

/** @type {React.Context<Readonly<Object>|null>} */
export const DependenciesContext = createContext(null);

/**
 * @param {{ container: import('../config/Container.js').Container, children: React.ReactNode }} props
 */
export function DependenciesProvider({ container, children }) {
  // useMemo y no useState: el grafo es inmutable durante toda la vida de la app.
  const services = useMemo(
    () =>
      Object.freeze({
        listCreditProducts: container.resolve('listCreditProductsUseCase'),
        searchCreditProducts: container.resolve('searchCreditProductsUseCase'),
        getAmountRangeFilters: container.resolve('getAmountRangeFiltersUseCase'),
        getCreditProductNames: container.resolve('getCreditProductNamesUseCase'),
        simulateCredit: container.resolve('simulateCreditUseCase'),
        submitCreditApplication: container.resolve('submitCreditApplicationUseCase'),
        validateApplicationDraft: container.resolve('validateCreditApplicationDraftUseCase'),
        listMyApplications: container.resolve('listMyApplicationsUseCase'),
        notifier: container.resolve('notifier'),
        termOptions: container.resolve('termOptions'),

        /* Puerto `IMoneyFormatter`, no el adaptador. Lo necesita el resumen
           de la solicitud, que muestra un monto que el usuario acaba de
           teclear y para el que todavía no existe ningún DTO. La alternativa
           —formatear pesos a mano en la vista— duplicaría la moneda y el
           locale fuera de `AppConfig`. La vista sigue sin conocer `Intl`. */
        moneyFormatter: container.resolve('moneyFormatter'),
      }),
    [container],
  );

  return (
    <DependenciesContext.Provider value={services}>{children}</DependenciesContext.Provider>
  );
}
