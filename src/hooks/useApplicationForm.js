import { useCallback, useEffect, useRef, useState } from 'react';

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
 * Admite un prellenado procedente del simulador. Los valores entran como
 * cualquier otro: pasan por la MISMA validación. Venir de la URL no les da
 * ningún privilegio —un enlace manipulado a mano se rechaza igual que un
 * valor tecleado.
 *
 * @param {{ prefill?: Partial<typeof EMPTY_FORM>|null }} [options]
 * @returns {Object} Estado y acciones del formulario.
 *
 * Capa: PRESENTACIÓN (hook).
 */
export function useApplicationForm({ prefill = null } = {}) {
  const {
    submitCreditApplication,
    validateApplicationDraft,
    getCreditProductNames,
    notifier,
    termOptions,
  } = useDependencies();

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [productNames, setProductNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  /* El prellenado se aplica UNA vez. Sin esta marca, cada render con la
     misma URL pisaría lo que el usuario acabara de escribir. */
  const prefillApplied = useRef(false);

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

  /* Traspaso desde el simulador. */
  useEffect(() => {
    if (prefillApplied.current || !prefill) return;

    const entries = Object.entries(prefill).filter(([, value]) => value !== '' && value != null);
    if (entries.length === 0) return;

    prefillApplied.current = true;
    setValues((current) => ({ ...current, ...Object.fromEntries(entries) }));
  }, [prefill]);

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

  /** Marca como tocados los campos indicados, para revelar sus errores. */
  const markManyTouched = useCallback((names) => {
    setTouched((current) => ({
      ...current,
      ...Object.fromEntries(names.map((name) => [name, true])),
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setReference(null);
    setSubmittedEmail('');
  }, []);

  /**
   * @param {React.FormEvent} event
   */
  const submit = useCallback(
    async (event) => {
      // Llega tanto del `onSubmit` del formulario como del `onClick` del
      // botón final; en el segundo caso no hay nada que prevenir.
      event?.preventDefault?.();

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
      notifier.success(`Solicitud registrada correctamente para ${applicantFirstName}.`);

      // El correo se guarda ANTES de limpiar: la confirmación enlaza a
      // "Mis solicitudes" prellenando la búsqueda con él.
      setSubmittedEmail(String(values.email ?? '').trim().toLowerCase());
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

  /**
   * ¿Están libres de error los campos indicados? Lo usa el paso a paso para
   * decidir si puede avanzar. Pregunta por `errors`, no por `touched`: un
   * campo obligatorio que nunca se tocó sigue estando vacío y sigue siendo un
   * error, aunque todavía no se le haya pintado el mensaje.
   *
   * @param {string[]} names
   * @returns {boolean}
   */
  const areFieldsValid = useCallback(
    (names) => names.every((name) => !errors[name]),
    [errors],
  );

  return {
    values,
    errorFor,
    areFieldsValid,
    setValue,
    markTouched,
    markManyTouched,
    submit,
    reset,
    productNames,
    termOptions,
    isSubmitting,
    reference,
    submittedEmail,
    hasErrors: Object.keys(errors).length > 0,
  };
}
