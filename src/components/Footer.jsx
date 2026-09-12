import { Logo } from './Logo.jsx';

/**
 * Footer — pie de página.
 *
 * Tres zonas: marca y lema a la izquierda, una línea editorial en el centro
 * y el aviso de autoría a la derecha. En móvil se apilan centradas.
 *
 * El fondo se mantiene azul financiero en los dos temas: el pie cierra la
 * página con identidad, no con el color de fondo de turno.
 *
 * Capa: PRESENTACIÓN (componente).
 */

const TAGLINE = 'Más que crédito, progreso para ti.';
const QUOTE = '«Hoy es un buen momento para construir el mañana.»';
const COPY = '© 2026 CreditSmart — FinTech Solutions S.A.S · Proyecto académico';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container container--wide">
        <div>
          <Logo className="logo--inverse" />
          <p className="footer__tagline">{TAGLINE}</p>
        </div>

        <p className="footer__quote footer__center">{QUOTE}</p>

        <p className="footer__copy footer__end">{COPY}</p>
      </div>
    </footer>
  );
}
