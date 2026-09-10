import { IUseCase } from '../contracts/IUseCase.js';
import { assertImplements } from '../../domain/contracts/Contract.js';
import { ICreditProductRepository } from '../../domain/contracts/ICreditProductRepository.js';
import { IAmountRangeProvider } from '../../domain/contracts/IAmountRangeProvider.js';
import { ProductSearchCriteria } from '../../domain/criteria/ProductSearchCriteria.js';
import { AmountRange } from '../../domain/valueobjects/AmountRange.js';
import { CreditProductMapper } from '../mappers/CreditProductMapper.js';
import { Result } from '../shared/Result.js';

/**
 * SearchCreditProductsUseCase — CASO DE USO (query con filtros).
 *
 * Traduce la entrada primitiva del formulario del simulador a un
 * `ProductSearchCriteria` de dominio y delega el filtrado al repositorio.
 *
 * Acepta el rango de monto de dos formas:
 *  - `amountRangeIndex`: la posición elegida en el `<select>`. El caso de uso
 *    la resuelve contra `IAmountRangeProvider`, de modo que la interfaz solo
 *    envía números y nunca construye value objects del dominio.
 *  - `amountRange`: un `AmountRange` ya construido, para quien lo tenga.
 *
 * Capa: APLICACIÓN.
 */
export class SearchCreditProductsUseCase extends IUseCase {
  /** @type {ICreditProductRepository} */
  #repository;
  /** @type {CreditProductMapper} */
  #mapper;
  /** @type {IAmountRangeProvider|null} */
  #amountRangeProvider;

  /**
   * @param {{
   *   productRepository: ICreditProductRepository,
   *   productMapper: CreditProductMapper,
   *   amountRangeProvider?: IAmountRangeProvider|null
   * }} deps
   */
  constructor({ productRepository, productMapper, amountRangeProvider = null }) {
    super();
    assertImplements(productRepository, ICreditProductRepository);
    if (amountRangeProvider) assertImplements(amountRangeProvider, IAmountRangeProvider);

    this.#repository = productRepository;
    this.#mapper = productMapper;
    this.#amountRangeProvider = amountRangeProvider;
  }

  /**
   * @param {{ query?: string, amountRange?: AmountRange|null, amountRangeIndex?: number|string|null }} [input]
   * @returns {Promise<Result>} Result<{ products: CreditProductDTO[], matched: number, total: number, criteria: Object, isFiltered: boolean }>
   */
  async execute({ query = '', amountRange = null, amountRangeIndex = null } = {}) {
    try {
      const range = amountRange ?? (await this.#resolveRange(amountRangeIndex));
      const criteria = new ProductSearchCriteria({ query, amountRange: range });
      const products = await this.#repository.findByCriteria(criteria);
      const total = await this.#repository.count();

      return Result.ok({
        products: this.#mapper.toDTOList(products),
        matched: products.length,
        total,
        criteria: criteria.toJSON(),
        isFiltered: !criteria.isEmpty,
      });
    } catch (err) {
      return Result.fromError(err);
    }
  }

  /**
   * @param {number|string|null} index
   * @returns {Promise<AmountRange|null>}
   */
  async #resolveRange(index) {
    if (index === null || index === '' || !this.#amountRangeProvider) return null;
    return this.#amountRangeProvider.byIndex(index);
  }
}
