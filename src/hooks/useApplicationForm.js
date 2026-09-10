import { useCallback, useEffect, useState } from 'react';

import { useDependencies } from './useDependencies.js';

/** Estado inicial del formulario: todos los campos, todos vacíos. */
const EMPTY_FORM = Object.freeze({
  fullName: '',
  idNumber: '',
  email: '',
  phone: '',
  productName: '',
  amount: '',
  termInMonths: '',
  purpose: '',
  companyName: '',
  jobTitle: '',
  monthlyIncome: '',
});

/**
 * useApplicationForm — estado del formulario de solicitud.
 *
 * Hace el papel del `ApplicationController` de la Actividad 1:
 *
 *  - Guarda los valores de los once campos (formulario 100% controlado).
 *  - Valida en cada cambio con `ValidateCreditApplicationDraftUseCase`, que
 *    aplica las reglas de los value objects del dominio. La interfaz no
 *    reimplementa la validación de correo, cédula ni montos: pide la
 *    validación y pinta los mensajes que le devuelven.
 *  - Solo muestra el error de un campo cuando el usuario ya lo ha tocado, para
 *    no llenar de rojo un formulario recién abierto.
 *  - Al enviar invoca `SubmitCreditApplicationUseCase`, avisa por el puerto
 *    `INotifier` y limpia el formulario si se radicó.
 *
 * @returns {Object} Estado y acciones del formulario.
 *
 * Capa: PRESENTACIÓN (hook).
 */
export function useApplicationForm() {
  const { submitCreditApplication, validateApplicationDraft, getCreditProductNames, notifier, termOptions } =
    useDependencies();

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [productNames, setProductNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState(null);

  /* Opciones del desplegable "Tipo de crédito": se derivan del catálogo, no se
     escriben a mano. Así no puede desincronizarse con los productos. */
  useEffect(() => {
    let cancelled = false;

    async function loadNames() {
      const result = await getCreditProductNames.execute();
      if (cancelled) return;

      if (result.isFailure) {
        notifier.error(result.error);
        return;
      }
      setProductNames(result.value);
    }

    loadNames();

    return () => {
      cancelled = true;
    };
  }, [getCreditProductNames, notifier]);

  /* Validación en vivo con las reglas del dominio. */
  useEffect(() => {
    let cancelled = false;

    async function validate() {
      const result = await validateApplicationDraft.execute(values);
      if (cancelled) return;

      setErrors(result.isSuccess ? {} : result.fieldErrors);
    }

    validate();

    return () => {
      cancelled = true;
    };
  }, [values, validateApplicationDraft]);

  /**
   * @param {string} name
   * @param {string} value
   */
  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }, []);

  /** @param {string} name */
  const markTouched = useCallback((name) => {
    setTouched((current) => ({ ...current, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setReference(null);
  }, []);

  /**
   * @param {React.FormEvent} event
   */
  const submit = useCallback(
    async (event) => {
      event.preventDefault();

      // Al enviar se muestran todos los errores, no solo los de campos tocados.
      setTouched(Object.fromEntries(Object.keys(EMPTY_FORM).map((name) => [name, true])));
      setIsSubmitting(true);

      const result = await submitCreditApplication.execute(values);
      setIsSubmitting(false);

      if (result.isFailure) {
        setErrors(result.fieldErrors);
        notifier.error(result.error);
        return;
      }

      const { reference: radicado, applicantFirstName } = result.value;
      notifier.success(
        `${applicantFirstName}, tu solicitud quedó radicada con el número ${radicado}.`,
      );

      setValues(EMPTY_FORM);
      setTouched({});
      setErrors({});
      setReference(radicado);
    },
    [submitCreditApplication, values, notifier],
  );

  /**
   * Error visible de un campo: existe y el usuario ya pasó por él.
   *
   * @param {string} name
   * @returns {string}
   */
  const errorFor = useCallback(
    (name) => (touched[name] ? (errors[name] ?? '') : ''),
    [errors, touched],
  );

  return {
    values,
    errorFor,
    setValue,
    markTouched,
    submit,
    reset,
    productNames,
    termOptions,
    isSubmitting,
    reference,
    hasErrors: Object.keys(errors).length > 0,
  };
}
