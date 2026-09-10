import { IUseCase } from '../contracts/IUseCase.js';
import { CreditApplicationMapper } from '../mappers/CreditApplicationMapper.js';
import { Result } from '../shared/Result.js';

/**
 * ValidateCreditApplicationDraftUseCase — CASO DE USO (query).
 *
 * Valida un borrador del formulario de solicitud SIN radicarlo ni persistir
 * nada. Existe para que el formulario pueda avisar mientras el usuario
 * escribe usando exactamente las mismas reglas que se aplicarán al enviar:
 * las de los value objects `Applicant`, `RequestedCredit` y `EmploymentInfo`.
 *
 * Sin él, la interfaz tendría que reimplementar la validación de correo, de
 * cédula y de montos, y habría dos verdades sobre lo que es válido. Con él, la
 * presentación no importa ningún value object: manda datos planos y recibe
 * `fieldErrors` planos.
 *
 * Capa: APLICACIÓN.
 */
export class ValidateCreditApplicationDraftUseCase extends IUseCase {
  /**
   * @param {Object} rawForm Datos planos del formulario, posiblemente incompletos.
   * @returns {Promise<Result>} Result<{ isValid: true }> o fallo con fieldErrors.
   */
  async execute(rawForm = {}) {
    try {
      CreditApplicationMapper.toValueObjects(rawForm);
      return Result.ok({ isValid: true });
    } catch (err) {
      return Result.fromError(err);
    }
  }
}
