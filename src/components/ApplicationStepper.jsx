import { Icon } from './Icon.jsx';

/**
 * ApplicationStepper — indicador de avance de la solicitud.
 *
 * Es un INDICADOR, no una navegación. El usuario no puede saltar a un paso
 * que aún no ha completado, así que los hitos no son botones: un control que
 * parece pulsable y no lo es engaña más de lo que ayuda.
 *
 * El paso actual se marca con `aria-current="step"` y los ya superados con
 * `data-complete`, que es lo que usa el CSS. No se guarda ninguna entidad de
 * flujo: el paso es estado local del formulario.
 *
 * @param {{ steps: ReadonlyArray<string>, currentStep: number }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function ApplicationStepper({ steps, currentStep }) {
  return (
    <ol className="stepper" aria-label="Progreso de la solicitud">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCurrent = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <li
            key={label}
            className="stepper__item"
            aria-current={isCurrent ? 'step' : undefined}
            data-complete={isComplete ? 'true' : undefined}
          >
            <span className="stepper__dot" aria-hidden="true">
              {isComplete ? <Icon name="check-circle" /> : step}
            </span>

            <span className="stepper__label">
              {label}
              {isComplete && <span className="sr-only"> (completado)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
