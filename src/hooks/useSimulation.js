import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDependencies } from './useDependencies.js';

/** Plazo con el que se propone la primera simulación, si el producto lo admite. */
const DEFAULT_TERM_MONTHS = 12;

/**
 * useSimulation — estado del simulador de crédito.
 *
 * Hace el papel del `SimulatorController` de la Actividad 1 en su parte de
 * cálculo: guarda producto, monto y plazo, y llama a `SimulateCreditUseCase`
 * cada vez que cambia cualquiera de los tres. La cuota se recalcula sola.
 *
 * No calcula nada por su cuenta. La fórmula de la cuota, el reparto entre
 * intereses y capital, el ajuste de la última cuota y el formato en pesos
 * viven en el dominio y en el mapper de la capa de aplicación. Aquí solo
 * llegan cifras ya formateadas y, si el monto o el plazo no son válidos, los
 * errores por campo que produjo el dominio.
 *
 * @param {Array<Object>} catalog Productos disponibles (DTOs).
 * @returns {Object} Estado y acciones del simulador.
 *
 * Capa: PRESENTACIÓN (hook).
 */
export function useSimulation(catalog) {
  const { simulateCredit } = useDependencies();

  const [form, setForm] = useState({ productId: '', amount: '', termInMonths: '' });
  const [simulation, setSimulation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleMode, setScheduleMode] = useState('yearly');

  /** Producto elegido, ya en formato DTO. */
  const selectedProduct = useMemo(
    () => catalog.find((product) => String(product.id) === String(form.productId)) ?? null,
    [catalog, form.productId],
  );

  /* Propuesta inicial en cuanto llega el catálogo: primer producto, su monto
     mínimo y un plazo corto. Así la página nunca se ve vacía. */
  useEffect(() => {
    if (form.productId || catalog.length === 0) return;

    const [first] = catalog;
    setForm({
      productId: String(first.id),
      amount: String(first.minAmount),
      termInMonths: String(Math.min(DEFAULT_TERM_MONTHS, first.maxTermMonths)),
    });
  }, [catalog, form.productId]);

  /* Recálculo automático: cualquier cambio de producto, monto o plazo dispara
     el caso de uso. No hay que pulsar "Calcular". */
  useEffect(() => {
    if (!form.productId) return undefined;

    let cancelled = false;

    async function simulate() {
      const result = await simulateCredit.execute({
        productId: form.productId,
        amount: form.amount,
        termInMonths: form.termInMonths,
      });
      if (cancelled) return;

      if (result.isFailure) {
        setSimulation(null);
        setErrors(result.fieldErrors);
        return;
      }

      setSimulation(result.value);
      setErrors({});
    }

    simulate();

    return () => {
      cancelled = true;
    };
  }, [form, simulateCredit]);

  /**
   * Al cambiar de producto, monto y plazo se ajustan a los límites del nuevo:
   * un plazo de 240 meses no se puede arrastrar a un crédito educativo.
   * El recorte es una cortesía de la interfaz; el límite real lo impone el
   * dominio, que rechazaría el valor igualmente.
   *
   * @param {string} productId
   */
  const selectProduct = useCallback(
    (productId) => {
      const product = catalog.find((item) => String(item.id) === String(productId));
      if (!product) return;

      setForm((current) => ({
        productId: String(productId),
        amount: String(Math.max(product.minAmount, Number(current.amount) || 0)),
        termInMonths: String(
          Math.min(Number(current.termInMonths) || DEFAULT_TERM_MONTHS, product.maxTermMonths),
        ),
      }));
    },
    [catalog],
  );

  /** @param {string} amount */
  const setAmount = useCallback((amount) => {
    setForm((current) => ({ ...current, amount }));
  }, []);

  /** @param {string} termInMonths */
  const setTerm = useCallback((termInMonths) => {
    setForm((current) => ({ ...current, termInMonths }));
  }, []);

  /** Vuelve a la propuesta inicial del producto elegido. */
  const reset = useCallback(() => {
    if (!selectedProduct) return;

    setForm({
      productId: String(selectedProduct.id),
      amount: String(selectedProduct.minAmount),
      termInMonths: String(Math.min(DEFAULT_TERM_MONTHS, selectedProduct.maxTermMonths)),
    });
    setErrors({});
  }, [selectedProduct]);

  const toggleSchedule = useCallback(() => {
    setIsScheduleOpen((open) => !open);
  }, []);

  return {
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
  };
}
