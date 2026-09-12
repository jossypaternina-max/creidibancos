import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ROUTES, ROUTE_TITLES, PREFILL_PARAMS } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useDependencies } from '../hooks/useDependencies.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { useApplicationForm } from '../hooks/useApplicationForm.js';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Icon } from '../components/Icon.jsx';
import { FormField } from '../components/FormField.jsx';
import { ApplicationStepper } from '../components/ApplicationStepper.jsx';
import { ApplicationSummary } from '../components/ApplicationSummary.jsx';
import { SecurityPanel } from '../components/SecurityPanel.jsx';

/**
 * ApplicationPage — página de la ruta `/solicitar`.
 *
 * Los once campos de siempre, con las mismas reglas de validación, repartidos
 * en tres pasos visuales más una confirmación. Lo único que cambia es
 * **cuántos campos se ven a la vez**: el objeto que se envía al caso de uso es
 * idéntico al de antes, y el envío sigue ocurriendo una sola vez, al final.
 *
 * Si la solicitud llega desde el simulador (`?product=&amount=&term=`), esos
 * tres valores entran prellenados y se muestran en un resumen. No se les
 * concede ningún privilegio: pasan por la misma validación que si se
 * hubieran tecleado, así que un enlace manipulado se rechaza igual.
 *
 * La página no valida: `useApplicationForm` pide la validación al caso de uso,
 * que aplica las reglas de los value objects del dominio, y aquí solo se
 * pintan los mensajes.
 *
 * Capa: PRESENTACIÓN (página).
 */

/** Hitos del indicador de avance. El cuarto es el acuse, no un formulario. */
const STEPS = Object.freeze([
  'Tus datos',
  'Crédito y finanzas',
  'Datos laborales',
  'Confirmación',
]);

/** Qué campos vive en cada paso. Es la ÚNICA fuente de esa agrupación. */
const STEP_FIELDS = Object.freeze([
  ['fullName', 'idNumber', 'email', 'phone'],
  ['productName', 'amount', 'termInMonths', 'purpose'],
  ['companyName', 'jobTitle', 'monthlyIncome'],
]);

const LAST_FORM_STEP = STEP_FIELDS.length;

export function ApplicationPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.APPLICATION]);

  const [searchParams] = useSearchParams();
  const { moneyFormatter } = useDependencies();
  const { products: catalog } = useCreditProducts();
  const [currentStep, setCurrentStep] = useState(1);

  /* Traspaso desde el simulador: el identificador del producto se traduce a
     su nombre, que es lo que guarda este formulario. Si el id no existe en el
     catálogo, simplemente no se prellena nada. */
  const prefill = useMemo(() => {
    const productId = searchParams.get(PREFILL_PARAMS.PRODUCT);
    const amount = searchParams.get(PREFILL_PARAMS.AMOUNT);
    const term = searchParams.get(PREFILL_PARAMS.TERM);

    if (!productId && !amount && !term) return null;
    if (catalog.length === 0) return null;

    const product = catalog.find((item) => String(item.id) === String(productId));

    return {
      productName: product ? product.name : '',
      amount: amount ?? '',
      termInMonths: term ?? '',
    };
  }, [searchParams, catalog]);

  const {
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
  } = useApplicationForm({ prefill });

  const sections = buildSections({ productNames, termOptions, currentTerm: values.termInMonths });
  const activeSection = sections[currentStep - 1];
  const canContinue = areFieldsValid(STEP_FIELDS[currentStep - 1] ?? []);

  /** Resumen del crédito solicitado, con el monto ya formateado por el puerto. */
  const summaryItems = [
    { label: 'Producto', value: values.productName },
    {
      label: 'Monto solicitado',
      value: values.amount ? moneyFormatter.format(Number(values.amount)) : '',
    },
    { label: 'Plazo', value: values.termInMonths ? `${values.termInMonths} meses` : '' },
  ];

  function goNext() {
    // Avanzar revela los errores del paso actual: si los hay, no se pasa.
    markManyTouched(STEP_FIELDS[currentStep - 1]);
    if (!canContinue) return;
    setCurrentStep((step) => Math.min(step + 1, LAST_FORM_STEP));
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  function startOver() {
    reset();
    setCurrentStep(1);
  }

  /* ---------- Confirmación ---------- */
  if (reference) {
    return (
      <div className="container container--reading">
        <Breadcrumb
          items={[{ label: 'Inicio', to: ROUTES.CATALOG }, { label: 'Solicitar' }]}
        />

        <section className="section section--compact">
          <ApplicationStepper steps={STEPS} currentStep={STEPS.length} />

          <div className="confirmation">
            <span className="confirmation__icon" aria-hidden="true">
              <Icon name="check-circle" />
            </span>

            <h1 className="confirmation__title">Solicitud registrada</h1>

            <p className="confirmation__text">
              Tu solicitud fue registrada correctamente. Guarda este número para hacer
              seguimiento.
            </p>

            {/* El radicado no vive solo en un aviso que se va a los seis
                segundos: queda en pantalla hasta que el usuario decide irse. */}
            <p className="confirmation__reference">
              <span className="confirmation__reference-label">Número de radicado</span>
              <strong className="confirmation__reference-value">{reference}</strong>
            </p>

            <div className="confirmation__actions">
              <Link className="btn btn--primary" to={ROUTES.CATALOG}>
                Volver al inicio
              </Link>

              <button type="button" className="btn btn--outline" onClick={startOver}>
                Registrar otra solicitud
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- Formulario ---------- */
  return (
    <div className="container container--wide">
      <Breadcrumb items={[{ label: 'Inicio', to: ROUTES.CATALOG }, { label: 'Solicitar' }]} />

      <section className="section section--compact" aria-labelledby="solicitud-titulo">
        <h1 className="section__title" id="solicitud-titulo">
          Solicitud de crédito
        </h1>
        <p className="section__subtitle">Completa tus datos para registrar la solicitud.</p>

        <div className="section section--tight">
          <ApplicationStepper steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="split split--aside">
          <form className="form" onSubmit={submit} noValidate>
            <section className="form__section" aria-labelledby={`section-${activeSection.id}`}>
              <div className="form__section-head">
                <h2 className="form__section-title" id={`section-${activeSection.id}`}>
                  {activeSection.title}
                </h2>
                <p className="form__section-hint">{activeSection.hint}</p>
              </div>

              <div className="grid grid--form">
                {activeSection.fields.map((field) => (
                  <FormField
                    key={field.name}
                    {...field}
                    value={values[field.name]}
                    error={errorFor(field.name)}
                    onChange={setValue}
                    onBlur={markTouched}
                  />
                ))}
              </div>

              <div className="form__nav">
                {currentStep > 1 ? (
                  <button type="button" className="btn btn--ghost" onClick={goBack}>
                    Volver
                  </button>
                ) : (
                  <button type="button" className="btn btn--ghost" onClick={startOver}>
                    Limpiar formulario
                  </button>
                )}

                {/* Los dos botones llevan `key` propia y ninguno es
                    `type="submit"`.

                    Con un solo nodo reutilizado por React, el botón pasaba de
                    «Continuar» (`type="button"`) a «Enviar solicitud»
                    (`type="submit"`) durante el propio clic, ANTES de que el
                    navegador ejecutara la acción por defecto: ese mismo clic
                    acababa enviando el formulario, y el último paso se abría
                    con los tres campos en rojo y un aviso de error que el
                    usuario no había provocado.

                    El envío se dispara desde `onClick`, no desde el tipo del
                    botón, así que deja de depender de qué nodo reutilice
                    React. El `onSubmit` del formulario se mantiene por si el
                    envío llega por otra vía. */}
                {currentStep < LAST_FORM_STEP ? (
                  <button
                    key="continuar"
                    type="button"
                    className="btn btn--primary"
                    onClick={goNext}
                  >
                    Continuar
                    <Icon name="arrow-right" className="ui-icon ui-icon--sm" />
                  </button>
                ) : (
                  <button
                    key="enviar"
                    type="button"
                    className="btn btn--growth"
                    onClick={submit}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting ? 'true' : undefined}
                  >
                    {isSubmitting && <span className="btn__spinner" aria-hidden="true" />}
                    {isSubmitting ? 'Enviando solicitud…' : 'Enviar solicitud'}
                  </button>
                )}
              </div>
            </section>

            <p className="form-note">
              Los campos marcados con <span className="t-required">*</span> son obligatorios. La
              validación se ejecuta mientras escribes, con las mismas reglas que se aplican al
              enviar.
            </p>
          </form>

          <div className="stack stack--tight">
            <ApplicationSummary items={summaryItems} />
            <SecurityPanel />
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Definición declarativa del formulario: única fuente de verdad de etiquetas,
 * placeholders y tipos. Añadir un campo es añadir una entrada, no duplicar
 * marcado.
 *
 * @param {{ productNames: string[], termOptions: number[], currentTerm: string }} options
 * @returns {Array<Object>}
 */
function buildSections({ productNames, termOptions, currentTerm }) {
  /* El simulador admite cualquier plazo dentro del máximo del producto, y el
     formulario ofrece una lista corta. Si el plazo traspasado no está en la
     lista, se añade: descartarlo en silencio perdería la decisión que el
     usuario acaba de tomar. */
  const months = termOptions.includes(Number(currentTerm))
    ? termOptions
    : [...termOptions, Number(currentTerm)].filter(Boolean).sort((a, b) => a - b);

  return [
    {
      id: 'personal',
      title: 'Tus datos personales',
      hint: 'Comencemos con tu información básica.',
      fields: [
        {
          name: 'fullName',
          label: 'Nombre completo',
          type: 'text',
          placeholder: 'Ej: Juan Carlos Pérez',
          autoComplete: 'name',
        },
        { name: 'idNumber', label: 'Cédula', type: 'number', placeholder: 'Ej: 1234567890' },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          placeholder: 'Ej: juan@correo.com',
          autoComplete: 'email',
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'tel',
          placeholder: 'Ej: 3001234567',
          autoComplete: 'tel',
        },
      ],
    },
    {
      id: 'credit',
      title: 'Información del crédito',
      hint: 'Revisa el producto, el monto y el plazo que deseas solicitar.',
      fields: [
        {
          name: 'productName',
          label: 'Tipo de crédito',
          type: 'select',
          full: true,
          placeholderOption: '-- Seleccione un tipo --',
          options: productNames.map((name) => ({ value: name, label: name })),
        },
        {
          name: 'amount',
          label: 'Monto solicitado',
          type: 'number',
          placeholder: 'Ej: 5000000',
          min: 0,
          hint: 'Escribe el valor en pesos, sin puntos ni símbolos.',
        },
        {
          name: 'termInMonths',
          label: 'Plazo en meses',
          type: 'select',
          options: months.map((value) => ({ value, label: `${value} meses` })),
        },
        {
          name: 'purpose',
          label: 'Destino del crédito',
          type: 'textarea',
          full: true,
          rows: 3,
          placeholder: 'Describe el destino o uso que le darás al crédito…',
        },
      ],
    },
    {
      id: 'work',
      title: 'Datos laborales',
      hint: 'Cuéntanos sobre tu actividad e ingresos.',
      fields: [
        {
          name: 'companyName',
          label: 'Empresa donde trabajas',
          type: 'text',
          placeholder: 'Ej: Empresa ABC S.A.S',
          autoComplete: 'organization',
        },
        {
          name: 'jobTitle',
          label: 'Cargo',
          type: 'text',
          placeholder: 'Ej: Analista de Sistemas',
          autoComplete: 'organization-title',
        },
        {
          name: 'monthlyIncome',
          label: 'Ingresos mensuales',
          type: 'number',
          placeholder: 'Ej: 3500000',
          full: true,
          min: 0,
        },
      ],
    },
  ];
}
