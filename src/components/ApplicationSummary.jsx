/**
 * ApplicationSummary — resumen del crédito que se está solicitando.
 *
 * Aparece cuando la solicitud llega desde el simulador, para que el usuario
 * vea que sus valores viajaron con él, y en el último paso, antes de enviar.
 *
 * Recibe pares etiqueta/valor ya formateados. No conoce el DTO ni recalcula
 * nada: si un importe hay que pintarlo en pesos, llega en pesos.
 *
 * @param {{
 *   title?: string,
 *   items: Array<{ label: string, value: string }>
 * }} props
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function ApplicationSummary({ title = 'Resumen de tu solicitud', items }) {
  const visible = items.filter((item) => item.value);

  if (visible.length === 0) return null;

  return (
    <section className="application-summary" aria-labelledby="resumen-solicitud">
      <h2 className="application-summary__title" id="resumen-solicitud">
        {title}
      </h2>

      <dl className="application-summary__list">
        {visible.map(({ label, value }) => (
          <div className="application-summary__row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
