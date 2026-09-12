import { Icon } from './Icon.jsx';

/**
 * SecurityPanel — panel lateral del formulario de solicitud.
 *
 * Explica qué se hace con los datos que se están pidiendo, en el momento en
 * que se piden. Es la respuesta a la pregunta que se hace cualquiera antes de
 * teclear su cédula.
 *
 * Lo que NO dice es tan importante como lo que dice: no se nombra ninguna
 * tecnología de cifrado, ninguna certificación ni ninguna norma concreta.
 * Afirmar «SSL de 256 bits» o el cumplimiento de una ley sin tenerlo
 * documentado es exactamente el tipo de promesa que destruye la credibilidad
 * de un sitio financiero en cuanto alguien la comprueba.
 *
 * Capa: PRESENTACIÓN (componente).
 */

const GUARANTEES = Object.freeze([
  'Los datos se usan solo para evaluar esta solicitud',
  'No se comparten con terceros',
  'Puedes limpiar el formulario en cualquier momento',
]);

export function SecurityPanel() {
  return (
    <aside className="security-panel" aria-labelledby="seguridad-titulo">
      <span className="security-panel__icon" aria-hidden="true">
        <Icon name="shield-check" />
      </span>

      <h2 className="security-panel__title" id="seguridad-titulo">
        Tu información está protegida
      </h2>

      <p className="security-panel__text">
        Usamos prácticas de seguridad para proteger la información que ingresas en este
        formulario.
      </p>

      <ul className="security-panel__list">
        {GUARANTEES.map((text) => (
          <li className="security-panel__item" key={text}>
            <Icon name="check-circle" />
            {text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
