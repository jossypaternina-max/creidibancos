import { Icon } from './Icon.jsx';

/**
 * GoalPanel — panel de acompañamiento del simulador.
 *
 * Ocupa la tercera columna del espacio de trabajo: mientras la izquierda
 * decide y el centro calcula, aquí se recuerda por qué merece la pena
 * seguir. Es contenido estático, sin estado ni datos.
 *
 * Las tres garantías se eligieron por ser comprobables dentro de la propia
 * aplicación. No se promete un plazo de respuesta ni una aprobación: eso
 * sería afirmar un servicio que el proyecto no presta.
 *
 * Capa: PRESENTACIÓN (componente).
 */

const GUARANTEES = Object.freeze([
  'Ves el costo total antes de decidir',
  'Simulación inmediata y sin compromiso',
  'Proceso 100% en línea',
]);

export function GoalPanel() {
  return (
    <aside className="goal-panel" aria-labelledby="meta-titulo">
      <h2 className="goal-panel__title" id="meta-titulo">
        Tu próxima meta está más cerca
      </h2>

      <p className="goal-panel__text">
        Simula, compara y solicita en pocos minutos.
      </p>

      <div className="goal-panel__media">
        <img
          src="/assets/illustrations/calculator-credit.svg"
          alt=""
          aria-hidden="true"
          width="420"
          height="420"
          loading="lazy"
          decoding="async"
        />
      </div>

      <ul className="goal-panel__list">
        {GUARANTEES.map((text) => (
          <li className="goal-panel__item" key={text}>
            <Icon name="check-circle" />
            {text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
