import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { ICreditApplicationRepository } from '../../domain/contracts/ICreditApplicationRepository.js';
import { assertImplements } from '../../domain/contracts/Contract.js';
import { IIdGenerator } from '../../domain/contracts/IIdGenerator.js';
import { CreditApplicationFactory } from './factories/CreditApplicationFactory.js';

/**
 * FirestoreCreditApplicationRepository — ADAPTADOR de
 * `ICreditApplicationRepository` sobre Cloud Firestore.
 *
 * Persiste las solicitudes en la colección `solicitudes` de Firestore:
 *  - CREATE: `addDoc()` en `save()`.
 *  - READ:   `getDocs()` en `findAll()` / `findById()`.
 *  - QUERY:  `where()` + `orderBy()` en `findByApplicantEmail()`.
 *
 * Guarda, además del documento serializado (`toJSON()`), dos campos de nivel
 * superior: `applicantEmail` (para filtrar "Mis Solicitudes") y `createdAt`
 * como fecha (para ordenar). El id de negocio de la entidad viaja en el campo
 * `id`; el id del documento de Firestore es un respaldo.
 *
 * Degradación segura: si Firebase no está configurado (`db === null`), opera en
 * memoria para no romper el flujo en desarrollo. Si una operación de red falla,
 * relanza un error claro para que el caso de uso lo convierta en `Result` y la
 * interfaz lo muestre (requisito de manejo de errores de la actividad).
 *
 * Capa: INFRAESTRUCTURA (adaptador de persistencia).
 */
export class FirestoreCreditApplicationRepository extends ICreditApplicationRepository {
  static #COLLECTION = 'solicitudes';
  /** Tiempo máximo por operación antes de darla por fallida. */
  static #TIMEOUT_MS = 12000;

  /** @type {import('firebase/firestore').Firestore|null} */
  #db;
  /** @type {IIdGenerator} */
  #idGenerator;
  /** @type {import('../../application/contracts/ILogger.js').ILogger|null} */
  #logger;
  /** Respaldo en memoria cuando Firebase no está configurado. */
  #memory = new Map();

  /**
   * @param {{
   *   firebaseClient: import('../firebase/FirebaseClient.js').FirebaseClient,
   *   idGenerator: IIdGenerator,
   *   logger?: import('../../application/contracts/ILogger.js').ILogger
   * }} deps
   */
  constructor({ firebaseClient, idGenerator, logger = null }) {
    super();
    assertImplements(idGenerator, IIdGenerator);
    this.#db = firebaseClient?.db ?? null;
    this.#idGenerator = idGenerator;
    this.#logger = logger;
  }

  /** @returns {string} */
  nextIdentity() {
    return this.#idGenerator.generate('app');
  }

  /**
   * @param {import('../../domain/entities/CreditApplication.js').CreditApplication} application
   * @returns {Promise<import('../../domain/entities/CreditApplication.js').CreditApplication>}
   */
  async save(application) {
    if (!this.#db) {
      this.#memory.set(application.id, application);
      return application;
    }

    try {
      const payload = {
        ...application.toJSON(),
        // Campos de nivel superior para consultar y ordenar sin depender de
        // la estructura anidada.
        applicantEmail: application.applicant.email,
        createdAt: application.createdAt,
      };
      await this.#withTimeout(
        addDoc(collection(this.#db, FirestoreCreditApplicationRepository.#COLLECTION), payload),
      );
      this.#logger?.info('Solicitud guardada en Firestore', { reference: application.referenceNumber });
      return application;
    } catch (err) {
      this.#logger?.error('Firestore: fallo al guardar la solicitud', { message: err?.message });
      throw new Error('No se pudo guardar la solicitud en la nube. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<import('../../domain/entities/CreditApplication.js').CreditApplication|null>}
   */
  async findById(id) {
    if (!this.#db) return this.#memory.get(id) ?? null;

    try {
      const snapshot = await this.#withTimeout(
        getDocs(
          query(
            collection(this.#db, FirestoreCreditApplicationRepository.#COLLECTION),
            where('id', '==', id),
          ),
        ),
      );
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return CreditApplicationFactory.fromFirestore(doc.id, doc.data());
    } catch (err) {
      this.#logger?.error('Firestore: fallo al buscar la solicitud', { message: err?.message });
      throw new Error('No se pudo consultar la solicitud en la nube.');
    }
  }

  /**
   * @returns {Promise<import('../../domain/entities/CreditApplication.js').CreditApplication[]>}
   */
  async findAll() {
    if (!this.#db) return [...this.#memory.values()];

    try {
      const snapshot = await this.#withTimeout(
        getDocs(
          query(
            collection(this.#db, FirestoreCreditApplicationRepository.#COLLECTION),
            orderBy('createdAt', 'desc'),
          ),
        ),
      );
      return snapshot.docs.map((doc) => CreditApplicationFactory.fromFirestore(doc.id, doc.data()));
    } catch (err) {
      this.#logger?.error('Firestore: fallo al listar las solicitudes', { message: err?.message });
      throw new Error('No se pudieron cargar las solicitudes desde la nube.');
    }
  }

  /**
   * Consulta las solicitudes de un correo, más recientes primero.
   * Combina `where()` + `orderBy()` (requiere un índice compuesto que Firestore
   * ofrece crear con un clic la primera vez). Si el índice aún no existe,
   * degrada a filtrar por `where` y ordenar en cliente en lugar de fallar.
   *
   * @param {string} email
   * @returns {Promise<import('../../domain/entities/CreditApplication.js').CreditApplication[]>}
   */
  async findByApplicantEmail(email) {
    const clean = String(email ?? '').trim().toLowerCase();
    if (clean === '') return [];

    if (!this.#db) {
      return [...this.#memory.values()].filter((app) => app.applicant.email === clean);
    }

    const col = collection(this.#db, FirestoreCreditApplicationRepository.#COLLECTION);

    try {
      const snapshot = await this.#withTimeout(
        getDocs(query(col, where('applicantEmail', '==', clean), orderBy('createdAt', 'desc'))),
      );
      return snapshot.docs.map((doc) => CreditApplicationFactory.fromFirestore(doc.id, doc.data()));
    } catch (err) {
      // Índice compuesto ausente: Firestore lanza 'failed-precondition'.
      // Degradamos a solo `where` y ordenamos en cliente.
      if (err?.code === 'failed-precondition') {
        this.#logger?.warn('Firestore: falta índice compuesto; ordenando en cliente', {
          message: err?.message,
        });
        const snapshot = await this.#withTimeout(getDocs(query(col, where('applicantEmail', '==', clean))));
        return snapshot.docs
          .map((doc) => CreditApplicationFactory.fromFirestore(doc.id, doc.data()))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      this.#logger?.error('Firestore: fallo al consultar por correo', { message: err?.message });
      throw new Error('No se pudieron cargar tus solicitudes desde la nube.');
    }
  }

  /**
   * Corre una promesa de Firestore contra un tope de tiempo. El SDK reintenta
   * en silencio cuando el backend no responde (sin red, o API deshabilitada),
   * y una escritura puede quedar pendiente indefinidamente. Este tope convierte
   * ese cuelgue en un error claro para que la interfaz lo muestre —justo lo que
   * pide la prueba de "desconectar internet".
   *
   * @template T
   * @param {Promise<T>} promise
   * @returns {Promise<T>}
   */
  #withTimeout(promise) {
    let timer = null;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('La operación con la nube tardó demasiado. Revisa tu conexión.')),
        FirestoreCreditApplicationRepository.#TIMEOUT_MS,
      );
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }
}
