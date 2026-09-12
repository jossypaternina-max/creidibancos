import { Link } from 'react-router-dom';

import { ROUTES, ROUTE_TITLES } from '../config/routes.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useCreditProducts } from '../hooks/useCreditProducts.js';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Icon } from '../components/Icon.jsx';
import { Alert } from '../components/Alert.jsx';

/**
 * HelpPage — página de la ruta `/ayuda`.
 *
 * Preguntas frecuentes. Todas las respuestas salen de algo que la aplicación
 * realmente hace o de un dato que el catálogo realmente tiene: los requisitos
 * de cada producto son los del propio catálogo, no un texto inventado para
 * rellenar.
 *
 * Se usa `<details>`/`<summary>` nativos en lugar de un acordeón propio:
 * abren y cierran con teclado, los anuncia cualquier lector de pantalla y el
 * navegador los expande al buscar texto dentro de la página. Un acordeón
 * hecho a mano tendría que reimplementar las tres cosas.
 *
 * Capa: PRESENTACIÓN (página).
 */

/** Preguntas sobre el funcionamiento del sitio. */
const GENERAL_FAQ = Object.freeze([
  {
    question: '¿La simulación tiene algún costo o compromiso?',
    answer:
      'No. Simular es gratuito y no genera ninguna obligación. Puedes cambiar el monto y el plazo tantas veces como quieras antes de decidir.',
  },
  {
    question: '¿Cómo se calcula la cuota mensual?',
    answer:
      'Con el sistema de cuota fija: la tasa anual del producto se convierte a tasa mensual y se reparte el crédito en cuotas iguales. En la tabla de amortización puedes ver, cuota a cuota, cuánto va a intereses y cuánto abona capital.',
  },
  {
    question: '¿Por qué la última cuota a veces es diferente?',
    answer:
      'Porque las cuotas se redondean al peso. La diferencia acumulada de todos esos redondeos se ajusta en la última cuota, de modo que la suma total cuadre exactamente con lo que debes.',
  },
  {
    question: '¿Qué diferencia hay entre el simulador y la solicitud?',
    answer:
      'El simulador es una estimación informativa. La solicitud registra tus datos para que se evalúe el crédito; al enviarla recibes un número de radicado.',
  },
  {
    question: 'Simulé un crédito, ¿tengo que escribir los datos otra vez?',
    answer:
      'No. Desde el resultado de la simulación, el botón «Solicitar este crédito» lleva al formulario con el producto, el monto y el plazo ya rellenados.',
  },
  {
    question: '¿Qué pasa con la información que ingreso?',
    answer:
      'Se usa únicamente para evaluar la solicitud y no se comparte con terceros. Puedes limpiar el formulario en cualquier momento.',
  },
  {
    question: '¿Puedo usar el sitio en modo oscuro?',
    answer:
      'Sí. El sitio sigue el tema de tu sistema operativo, y el botón de la barra superior te permite forzar el modo claro o el oscuro. Tu elección se recuerda en este navegador.',
  },
]);

export function HelpPage() {
  useDocumentTitle(ROUTE_TITLES[ROUTES.HELP]);
  const { products, isLoading, error } = useCreditProducts();

  return (
    <div className="container container--reading">
      <Breadcrumb items={[{ label: 'Inicio', to: ROUTES.CATALOG }, { label: 'Ayuda' }]} />

      <section className="section section--compact" aria-labelledby="ayuda-titulo">
        <h1 className="section__title" id="ayuda-titulo">
          Preguntas frecuentes
        </h1>
        <p className="section__subtitle">
          Resolvemos las dudas más comunes sobre simular y solicitar un crédito.
        </p>

        <div className="section section--tight">
          <h2 className="faq__group-title">Sobre el proceso</h2>

          <div className="faq">
            {GENERAL_FAQ.map(({ question, answer }) => (
              <FaqItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </div>

        <div className="section section--tight">
          <h2 className="faq__group-title">Requisitos por producto</h2>

          {isLoading && (
            <Alert variant="empty" role="status">
              Cargando productos de crédito…
            </Alert>
          )}

          {error && (
            <Alert variant="error" role="alert" title="No pudimos cargar la información">
              {error}
            </Alert>
          )}

          {!isLoading && !error && (
            <div className="faq">
              {products.map((product) => (
                <FaqItem
                  key={product.id}
                  question={`¿Qué necesito para solicitar ${product.name}?`}
                  answer={`${product.requirements} El monto disponible va de ${product.minAmountLabel} a ${product.maxAmountLabel}, con un plazo máximo de ${product.maxTermMonths} meses y una tasa desde ${product.annualRateLabel} E.A.`}
                />
              ))}
            </div>
          )}
        </div>

        <Alert
          variant="info"
          title="¿No encontraste lo que buscabas?"
          action={
            <Link className="btn btn--outline" to={ROUTES.SIMULATOR}>
              Ir al simulador
            </Link>
          }
        >
          Prueba a simular tu crédito: verás la cuota, el total en intereses y el costo completo
          antes de solicitar nada.
        </Alert>
      </section>
    </div>
  );
}

/**
 * @param {{ question: string, answer: string }} props
 */
function FaqItem({ question, answer }) {
  return (
    <details className="faq__item">
      <summary className="faq__question">
        {question}
        <Icon name="chevron-down" className="ui-icon" />
      </summary>
      <p className="faq__answer">{answer}</p>
    </details>
  );
}
