import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useApplicationForm } from '../hooks/useApplicationForm.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Alert } from '../components/Alert.jsx';
import { FormField } from '../components/FormField.jsx';

/**
 * ApplicationPage — página de la ruta `/solicitar`.
 *
 * Formulario 100% controlado en tres secciones (Datos Personales · Datos del
 * Crédito · Datos Laborales), con los mismos campos, etiquetas y textos de
 * ayuda que en la Actividad 1.
 *
 * Las secciones se declaran como datos y se recorren con `.map()`: añadir un
 * campo es añadir una entrada, no duplicar marcado.
 *
 * La página no valida: `useApplicationForm` pide la validación al caso de uso,
 * que aplica las reglas de los value objects del dominio, y aquí solo se
 * pintan los mensajes.
 *
 * Capa: PRESENTACIÓN (página).
 */
export function ApplicationPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.APPLICATION]);

  const {
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
  } = useApplicationForm();

  const sections = buildSections({ productNames, termOptions });

  return (
    <div className="page">
      <Navbar />

      <main className="page__main form-page">
        <h1 className="section__title section__title--page">Solicitar Crédito</h1>
        <p className="section__subtitle">
          Completa el formulario y un asesor se comunicará contigo.
        </p>

        {reference && (
          <Alert variant="info" icon="✅">
            Solicitud radicada con el número <strong>{reference}</strong>. Guarda este número para
            hacer seguimiento.
          </Alert>
        )}

        <form className="form" onSubmit={submit} noValidate>
          {sections.map((section) => (
            <section
              key={section.id}
              className="form__section"
              aria-labelledby={`section-${section.id}`}
            >
              <h2 className="panel__title" id={`section-${section.id}`}>
                <span className={section.iconClass} aria-hidden="true">
                  {section.icon}
                </span>{' '}
                {section.title}
              </h2>
              <p className="panel__hint">{section.hint}</p>

              <div className="grid-form">
                {section.fields.map((field) => (
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
            </section>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Enviando…' : '✅ Enviar Solicitud'}
            </button>
            <button type="button" className="btn btn--outline-gray btn--block" onClick={reset}>
              🗑️ Limpiar Formulario
            </button>
          </div>

          <p className="form-note">
            Los campos marcados con <span className="t-required">*</span> son obligatorios. La
            validación se ejecuta mientras escribes, con las mismas reglas que se aplican al
            enviar.
          </p>
        </form>
      </main>

      <Footer variant="compact" />
    </div>
  );
}

/**
 * Definición declarativa del formulario: única fuente de verdad de etiquetas,
 * placeholders y tipos.
 *
 * @param {{ productNames: string[], termOptions: number[] }} options
 * @returns {Array<Object>}
 */
function buildSections({ productNames, termOptions }) {
  return [
    {
      id: 'personal',
      icon: '👤',
      iconClass: 'form__section-icon--personal',
      title: 'Datos Personales',
      hint: 'Información básica del solicitante',
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
          label: 'Email',
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
      icon: '💰',
      iconClass: 'form__section-icon--credit',
      title: 'Datos del Crédito',
      hint: 'Información sobre el crédito que desea solicitar',
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
          label: 'Monto solicitado ($)',
          type: 'number',
          placeholder: 'Ej: 5000000',
          min: 0,
        },
        {
          name: 'termInMonths',
          label: 'Plazo en meses',
          type: 'select',
          options: termOptions.map((months) => ({ value: months, label: `${months} meses` })),
        },
        {
          name: 'purpose',
          label: 'Destino del crédito',
          type: 'textarea',
          full: true,
          rows: 3,
          placeholder: 'Describe el destino o uso que le darás al crédito...',
        },
      ],
    },
    {
      id: 'work',
      icon: '🏢',
      iconClass: 'form__section-icon--work',
      title: 'Datos Laborales',
      hint: 'Información sobre tu situación laboral actual',
      fields: [
        {
          name: 'companyName',
          label: 'Empresa donde trabaja',
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
          label: 'Ingresos mensuales ($)',
          type: 'number',
          placeholder: 'Ej: 3500000',
          full: true,
          min: 0,
        },
      ],
    },
  ];
}
