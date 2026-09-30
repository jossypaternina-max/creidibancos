import { collection, getDocsFromServer, setDoc, doc } from 'firebase/firestore';

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
 * Degradación vs. error, deliberado:
 *  - Si Firebase no está configurado (`db === null`, p. ej. en desarrollo sin
 *    credenciales), usa el catálogo estático para no romper el arranque.
 *  - Si la colección está vacía (primer arranque), la siembra en segundo plano
 *    y devuelve el estático una sola vez; no es un fallo.
 *  - Si hay red configurada pero la consulta falla o se cuelga (sin internet,
 *    permisos, API deshabilitada), **relanza un error claro** en lugar de tapar
 *    el problema con datos locales. Así la interfaz muestra un mensaje de error
 *    en vez de un catálogo "por defecto" que engaña al usuario —justo lo que
 *    pide la prueba de "desconectar internet".
 *
 * Capa: INFRAESTRUCTURA (adaptador de persistencia).
 */
export class FirestoreCreditProductRepository extends ICreditProductRepository {
  static #COLLECTION = 'productos';
  /** Tiempo máximo por lectura antes de darla por fallida. */
  static #TIMEOUT_MS = 12000;

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
      // `getDocsFromServer` (no `getDocs`): fuerza ir al servidor y NO usa la
      // caché local de Firestore. Sin esto, offline el SDK devuelve el snapshot
      // cacheado —la app seguiría mostrando productos sin internet en vez de
      // avisar del fallo de conexión.
      const snapshot = await this.#withTimeout(
        getDocsFromServer(collection(this.#db, FirestoreCreditProductRepository.#COLLECTION)),
      );

      if (!snapshot.empty) {
        return snapshot.docs.map((d) => CreditProductFactory.fromRaw(d.data()));
      }

      // Colección vacía: sembramos en SEGUNDO PLANO (sin `await`) y devolvemos
      // el catálogo estático de inmediato. Así la pantalla nunca se queda
      // colgada esperando la escritura —caso del primer arranque, antes de que
      // exista dato alguno—; la próxima carga ya leerá de Firestore. Esto no es
      // un fallo de red: es la siembra inicial.
      if (!this.#seedChecked) {
        this.#seedChecked = true;
        this.#seedProducts().catch((err) =>
          this.#logger?.warn('Firestore: no se pudo sembrar el catálogo', { message: err?.message }),
        );
      }
      return CreditProductFactory.fromRawList(this.#seed);
    } catch (err) {
      // Red configurada pero la lectura falló o se colgó: NO tapamos con datos
      // locales. Relanzamos para que el caso de uso lo convierta en `Result` y
      // la interfaz muestre un mensaje de error.
      this.#logger?.error('Firestore: fallo al leer el catálogo', { message: err?.message });
      throw new Error('No se pudo cargar el catálogo de créditos desde la nube. Revisa tu conexión e inténtalo de nuevo.');
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

  /**
   * Corre una promesa de Firestore contra un tope de tiempo. Sin internet, el
   * SDK reintenta en silencio y la lectura puede quedar pendiente sin resolver
   * ni rechazar; este tope convierte ese cuelgue en un error para que la
   * interfaz lo muestre —clave para la prueba de "desconectar internet".
   *
   * @template T
   * @param {Promise<T>} promise
   * @returns {Promise<T>}
   */
  #withTimeout(promise) {
    let timer = null;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('La lectura del catálogo tardó demasiado. Revisa tu conexión.')),
        FirestoreCreditProductRepository.#TIMEOUT_MS,
      );
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }
}
