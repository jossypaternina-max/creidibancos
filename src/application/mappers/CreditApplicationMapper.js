import { Applicant } from '../../domain/valueobjects/Applicant.js';
import { RequestedCredit } from '../../domain/valueobjects/RequestedCredit.js';
import { EmploymentInfo } from '../../domain/valueobjects/EmploymentInfo.js';
import { ValidationError } from '../../domain/errors/ValidationError.js';
import { assertImplements } from '../../domain/contracts/Contract.js';
import { IMoneyFormatter } from '../../domain/contracts/IMoneyFormatter.js';
import { freezeApplicationDTO } from '../dto/CreditApplicationDTO.js';

/** Etiquetas legibles de cada estado de la solicitud. */
const STATUS_LABELS = Object.freeze({
  BORRADOR: 'Borrador',
  RADICADA: 'Radicada',
  EN_ESTUDIO: 'En estudio',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
});

/**
 * CreditApplicationMapper — traductor de solicitudes de crédito.
 *
 * Tiene dos responsabilidades simétricas:
 *  - ENTRADA CRUDA → VALUE OBJECTS (estático `toValueObjects`), para el formulario.
 *  - ENTIDAD → DTO (instancia `toDTO`), para el listado "Mis Solicitudes".
 *
 * Como instancia recibe el formateador por inyección (puerto `IMoneyFormatter`),
 * nunca lo instancia: Principio de Inversión de Dependencias, igual que
 * `CreditProductMapper`.
 *
 * `toValueObjects` acumula los errores de las TRES secciones en un único
 * `ValidationError`, para que el formulario pueda marcar todos los campos
 * fallidos en una sola pasada en vez de uno por intento.
 *
 * Capa: APLICACIÓN (mapper).
 */
export class CreditApplicationMapper {
  /** @type {IMoneyFormatter} */
  #moneyFormatter;

  /**
   * @param {{ moneyFormatter: IMoneyFormatter }} deps
   */
  constructor({ moneyFormatter }) {
    assertImplements(moneyFormatter, IMoneyFormatter);
    this.#moneyFormatter = moneyFormatter;
  }

  /**
   * Traduce una entidad de solicitud a un DTO plano y congelado.
   * @param {import('../../domain/entities/CreditApplication.js').CreditApplication} application
   * @returns {Readonly<import('../dto/CreditApplicationDTO.js').CreditApplicationDTO>}
   */
  toDTO(application) {
    const requested = application.requestedCredit;
    const amount = requested.amount.amount;
    const months = requested.term.months;

    return freezeApplicationDTO({
      id: application.id,
      reference: application.referenceNumber,
      status: application.status,
      statusLabel: STATUS_LABELS[application.status] ?? application.status,
      createdAt: application.createdAt.toISOString(),
      applicantName: application.applicant.fullName,
      applicantEmail: application.applicant.email,
      productName: requested.productName,
      amount,
      amountLabel: this.#moneyFormatter.format(amount),
      termInMonths: months,
      termLabel: `${months} meses`,
      purpose: requested.purpose,
    });
  }

  /**
   * @param {Array<import('../../domain/entities/CreditApplication.js').CreditApplication>} applications
   * @returns {Array<Readonly<import('../dto/CreditApplicationDTO.js').CreditApplicationDTO>>}
   */
  toDTOList(applications) {
    return applications.map((application) => this.toDTO(application));
  }

  /**
   * @param {{
   *   fullName?: string, idNumber?: string, email?: string, phone?: string,
   *   productName?: string, amount?: string|number,
   *   termInMonths?: string|number, purpose?: string,
   *   companyName?: string, jobTitle?: string, monthlyIncome?: string|number
   * }} raw
   * @returns {{ applicant: Applicant, requestedCredit: RequestedCredit, employmentInfo: EmploymentInfo }}
   * @throws {ValidationError} Con todos los errores de campo acumulados.
   */
  static toValueObjects(raw = {}) {
    const errors = {};
    let applicant = null;
    let requestedCredit = null;
    let employmentInfo = null;

    try {
      applicant = new Applicant({
        fullName: raw.fullName,
        idNumber: raw.idNumber,
        email: raw.email,
        phone: raw.phone,
      });
    } catch (err) {
      CreditApplicationMapper.#collect(errors, err);
    }

    try {
      requestedCredit = new RequestedCredit({
        productName: raw.productName,
        amount: raw.amount,
        termInMonths: raw.termInMonths,
        purpose: raw.purpose,
      });
    } catch (err) {
      CreditApplicationMapper.#collect(errors, err);
    }

    try {
      employmentInfo = new EmploymentInfo({
        companyName: raw.companyName,
        jobTitle: raw.jobTitle,
        monthlyIncome: raw.monthlyIncome,
      });
    } catch (err) {
      CreditApplicationMapper.#collect(errors, err);
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors, 'Hay campos obligatorios sin completar o inválidos.');
    }

    return { applicant, requestedCredit, employmentInfo };
  }

  /**
   * @param {Record<string,string>} target
   * @param {Error & { fieldErrors?: Record<string,string> }} err
   */
  static #collect(target, err) {
    if (err instanceof ValidationError) {
      Object.assign(target, err.fieldErrors);
      return;
    }
    // Un error no esperado no debe perderse silenciosamente.
    target._form = err?.message ?? 'Error al procesar el formulario.';
  }
}
