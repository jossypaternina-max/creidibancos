import { IUseCase } from '../contracts/IUseCase.js';
import { assertImplements } from '../../domain/contracts/Contract.js';
import { ICreditApplicationRepository } from '../../domain/contracts/ICreditApplicationRepository.js';
import { CreditApplicationMapper } from '../mappers/CreditApplicationMapper.js';
import { Result } from '../shared/Result.js';

/**
 * ListMyApplicationsUseCase — CASO DE USO (query).
 *
 * Devuelve las solicitudes de un correo como DTOs planos, para la página
 * "Mis Solicitudes". Delega la consulta `where` + `orderBy` en el repositorio
 * (puerto): no conoce Firestore ni el DOM.
 *
 * Como query, no registra en el logger. Nunca lanza: envuelve todo en `Result`.
 *
 * Capa: APLICACIÓN.
 */
export class ListMyApplicationsUseCase extends IUseCase {
  /** @type {ICreditApplicationRepository} */
  #repository;
  /** @type {CreditApplicationMapper} */
  #mapper;

  /**
   * @param {{
   *   applicationRepository: ICreditApplicationRepository,
   *   applicationMapper: CreditApplicationMapper
   * }} deps
   */
  constructor({ applicationRepository, applicationMapper }) {
    super();
    assertImplements(applicationRepository, ICreditApplicationRepository);
    this.#repository = applicationRepository;
    this.#mapper = applicationMapper;
  }

  /**
   * @param {{ email?: string }} [input]
   * @returns {Promise<Result>} Result<{ applications: CreditApplicationDTO[], total: number }>
   */
  async execute({ email } = {}) {
    try {
      const clean = String(email ?? '').trim();
      if (clean === '') {
        return Result.ok({ applications: [], total: 0 });
      }

      const applications = await this.#repository.findByApplicantEmail(clean);
      return Result.ok({
        applications: this.#mapper.toDTOList(applications),
        total: applications.length,
      });
    } catch (err) {
      return Result.fromError(err);
    }
  }
}
