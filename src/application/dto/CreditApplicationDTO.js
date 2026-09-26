/**
 * CreditApplicationDTO — objeto de transferencia (frontera aplicación →
 * presentación) para el listado "Mis Solicitudes".
 *
 * Estructura plana y ya formateada. La vista NO recibe la entidad
 * `CreditApplication`, así no puede invocar sus transiciones de estado ni
 * quedar acoplada a `Money`, `Term` o `Applicant`.
 *
 * @typedef {Object} CreditApplicationDTO
 * @property {string} id
 * @property {string} reference        Radicado, ej. "CS-1A2B3C4D"
 * @property {string} status           Estado crudo, ej. "RADICADA"
 * @property {string} statusLabel      Estado legible, ej. "Radicada"
 * @property {string} createdAt        Fecha ISO, para ordenar/formatear en vista
 * @property {string} applicantName
 * @property {string} applicantEmail
 * @property {string} productName
 * @property {number} amount           Monto crudo
 * @property {string} amountLabel      Monto formateado, ej. "$ 5.000.000"
 * @property {number} termInMonths
 * @property {string} termLabel        Ej. "36 meses"
 * @property {string} purpose
 *
 * Capa: APLICACIÓN (DTO).
 */

/**
 * Congela un DTO para que la presentación no lo mute por accidente.
 * @param {CreditApplicationDTO} dto
 * @returns {Readonly<CreditApplicationDTO>}
 */
export function freezeApplicationDTO(dto) {
  return Object.freeze(dto);
}
