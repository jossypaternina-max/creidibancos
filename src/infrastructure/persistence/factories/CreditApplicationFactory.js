import { CreditApplication } from '../../../domain/entities/CreditApplication.js';
import { Applicant } from '../../../domain/valueobjects/Applicant.js';
import { RequestedCredit } from '../../../domain/valueobjects/RequestedCredit.js';
import { EmploymentInfo } from '../../../domain/valueobjects/EmploymentInfo.js';

/**
 * CreditApplicationFactory — ANTICORRUPTION LAYER.
 *
 * Convierte un documento crudo de Firestore en la entidad `CreditApplication`
 * del dominio, reconstruyendo sus value objects. Aísla al dominio del formato
 * de Firestore: si mañana cambia la forma del documento, solo cambia este
 * archivo.
 *
 * El documento tiene la forma que produce `CreditApplication.toJSON()` más un
 * campo `applicantEmail` de nivel superior (para las consultas `where`) y un
 * `createdAt` que Firestore devuelve como `Timestamp`.
 *
 * Como los datos pasan por los constructores de los value objects, un documento
 * corrupto falla en la frontera, no dentro del dominio.
 *
 * Capa: INFRAESTRUCTURA (factory / mapper de persistencia).
 */
export class CreditApplicationFactory {
  /**
   * @param {string} docId Identificador del documento en Firestore (respaldo).
   * @param {Object} data `doc.data()` de Firestore.
   * @returns {CreditApplication}
   */
  static fromFirestore(docId, data = {}) {
    const applicant = new Applicant({
      fullName: data.applicant?.fullName,
      idNumber: data.applicant?.idNumber,
      email: data.applicant?.email ?? data.applicantEmail,
      phone: data.applicant?.phone,
    });

    const requestedCredit = new RequestedCredit({
      productName: data.requestedCredit?.productName,
      amount: data.requestedCredit?.amount,
      termInMonths: data.requestedCredit?.termInMonths,
      purpose: data.requestedCredit?.purpose,
    });

    const employmentInfo = new EmploymentInfo({
      companyName: data.employmentInfo?.companyName,
      jobTitle: data.employmentInfo?.jobTitle,
      monthlyIncome: data.employmentInfo?.monthlyIncome,
    });

    return new CreditApplication({
      id: data.id ?? docId,
      applicant,
      requestedCredit,
      employmentInfo,
      status: data.status,
      createdAt: CreditApplicationFactory.#toDate(data.createdAt),
    });
  }

  /**
   * Normaliza el `createdAt`: Firestore lo devuelve como `Timestamp` (con
   * `toDate()`); un respaldo en memoria puede traerlo como `Date` o cadena ISO.
   * @param {*} value
   * @returns {Date}
   */
  static #toDate(value) {
    if (value && typeof value.toDate === 'function') return value.toDate();
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }
}
