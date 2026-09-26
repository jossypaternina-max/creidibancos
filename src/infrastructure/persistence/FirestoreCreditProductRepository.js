import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

import { ICreditProductRepository } from '../../domain/contracts/ICreditProductRepository.js';
import { CreditProductFactory } from './factories/CreditProductFactory.js';
import { STATIC_CREDIT_PRODUCTS } from './datasources/StaticCreditProductDataSource.js';

/**
 * FirestoreCreditProductRepository — ADAPTADOR de `ICreditProductRepository`
 * sobre Cloud Firestore.
 *
 * Lee el catálogo de la colección `productos` con `getDocs()`. La primera vez,
 * si la colección está vacía, la siembra con el catálogo estático
 * (`setDoc()` con el id del producto como id de documento, para no duplicar en
 * ejecuciones posteriores). Así los productos "se gestionan desde una base de
 * datos" sin obligar a un script de carga manual.
 *
 * Reutiliza `CreditProductFactory` para traducir el documento crudo (claves en
 * español) a la entidad de dominio: la misma capa anticorrupción que ya usaba
 * el adaptador en memoria.
 *
 * Degradación segura: si Firebase no está configurado o la red falla, devuelve
 * el catálogo estático. El catálogo es funcionalidad esencial de la app: es
 * preferible mostrarlo desde datos locales a dejar la pantalla vacía.
 *
 * Capa: INFRAESTRUCTURA (adaptador de persistencia).
 */
export class FirestoreCreditProductRepository extends ICreditProductRepository {
  static #COLLECTION = 'productos';

  /** @type {import('firebase/firestore').Firestore|null} */
  #db;
  /** @type {import('../../application/contracts/ILogger.js').ILogger|null} */
  #logger;
  /** @type {Array<Object>} Catálogo crudo de respaldo y de siembra. */
  #seed;
  /** Evita reintentar la siembra en cada lectura. */
  #seedChecked = false;

  /**
   * @param {{
   *   firebaseClient: import('../firebase/FirebaseClient.js').FirebaseClient,
   *   logger?: import('../../application/contracts/ILogger.js').ILogger,
   *   dataSource?: Array<Object>
   * }} deps
   */
  constructor({ firebaseClient, logger = null, dataSource = STATIC_CREDIT_PRODUCTS }) {
    super();
    this.#db = firebaseClient?.db ?? null;
    this.#logger = logger;
    this.#seed = dataSource;
  }

  /**
   * @returns {Promise<import('../../domain/entities/CreditProduct.js').CreditProduct[]>}
   */
  async findAll() {
    if (!this.#db) return CreditProductFactory.fromRawList(this.#seed);

    try {
      const snapshot = await getDocs(collection(this.#db, FirestoreCreditProductRepository.#COLLECTION));

      if (!snapshot.empty) {
        return snapshot.docs.map((d) => CreditProductFactory.fromRaw(d.data()));
      }

      // Colección vacía: sembramos en SEGUNDO PLANO (sin `await`) y devolvemos
      // el catálogo estático de inmediato. Así la pantalla nunca se queda
      // colgada esperando la escritura —clave si Firestore aún no está
      // habilitado o no hay red—; la próxima carga ya leerá de Firestore.
      if (!this.#seedChecked) {
        this.#seedChecked = true;
        this.#seedProducts().catch((err) =>
          this.#logger?.warn('Firestore: no se pudo sembrar el catálogo', { message: err?.message }),
        );
      }
      return CreditProductFactory.fromRawList(this.#seed);
    } catch (err) {
      this.#logger?.warn('Firestore: catálogo no disponible, usando datos locales', {
        message: err?.message,
      });
      return CreditProductFactory.fromRawList(this.#seed);
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import('../../domain/entities/CreditProduct.js').CreditProduct|null>}
   */
  async findById(id) {
    const products = await this.findAll();
    return products.find((product) => String(product.id) === String(id)) ?? null;
  }

  /**
   * @param {import('../../domain/criteria/ProductSearchCriteria.js').ProductSearchCriteria} criteria
   * @returns {Promise<import('../../domain/entities/CreditProduct.js').CreditProduct[]>}
   */
  async findByCriteria(criteria) {
    const products = await this.findAll();
    if (!criteria || typeof criteria.isSatisfiedBy !== 'function') return products;
    return products.filter((product) => criteria.isSatisfiedBy(product));
  }

  /** @returns {Promise<number>} */
  async count() {
    const products = await this.findAll();
    return products.length;
  }

  /**
   * Siembra la colección `productos` con el catálogo estático. Usa el id del
   * producto como id de documento para que reejecutar no cree duplicados.
   */
  async #seedProducts() {
    this.#logger?.info('Firestore: sembrando catálogo de productos por primera vez');
    for (const raw of this.#seed) {
      await setDoc(
        doc(this.#db, FirestoreCreditProductRepository.#COLLECTION, String(raw.id)),
        { ...raw },
      );
    }
  }
}
