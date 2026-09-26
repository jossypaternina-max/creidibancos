import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * FirebaseClient — RECURSO TÉCNICO de infraestructura.
 *
 * Inicializa la app de Firebase y expone la instancia de Firestore que los
 * repositorios consumen. NO implementa ningún puerto del dominio: es un detalle
 * técnico compartido (como una conexión a base de datos), igual que el elemento
 * `#notifications` que el contenedor registra como valor. Por eso no lleva
 * `assertImplements`.
 *
 * La configuración entra por constructor —nunca lee `import.meta.env` por su
 * cuenta— para respetar la regla de que ninguna clase lee configuración global.
 * La lee `config/dependencies.js`, el composition root.
 *
 * Degradación segura: si faltan credenciales o `initializeApp` falla, `db`
 * queda en `null` e `isConfigured` en `false`. Los repositorios lo detectan y
 * degradan a memoria/estático en lugar de romper el arranque. Así la app
 * funciona en desarrollo sin `.env` y la suite de arranque pasa sin red.
 *
 * Capa: INFRAESTRUCTURA (recurso técnico).
 */
export class FirebaseClient {
  /** @type {import('firebase/app').FirebaseApp|null} */
  #app = null;
  /** @type {import('firebase/firestore').Firestore|null} */
  #db = null;
  /** @type {boolean} */
  #configured = false;

  /** Claves mínimas sin las que no tiene sentido inicializar Firebase. */
  static #REQUIRED = ['apiKey', 'authDomain', 'projectId', 'appId'];

  /**
   * @param {{ config: Object, logger?: import('../../application/contracts/ILogger.js').ILogger }} deps
   */
  constructor({ config, logger = null } = {}) {
    const cfg = config ?? {};
    const complete = FirebaseClient.#REQUIRED.every((key) => {
      const value = cfg[key];
      return typeof value === 'string' && value.trim() !== '';
    });

    if (!complete) {
      logger?.warn(
        'Firebase sin configurar (faltan variables VITE_FIREBASE_*). ' +
          'La app funcionará en modo degradado con datos locales.',
      );
      return;
    }

    try {
      // getApps() evita reinicializar la app en recargas en caliente (HMR).
      this.#app = getApps().length > 0 ? getApp() : initializeApp(cfg);
      this.#db = getFirestore(this.#app);
      this.#configured = true;
      logger?.info('Firebase inicializado', { projectId: cfg.projectId });
    } catch (err) {
      logger?.error('No se pudo inicializar Firebase; se degrada a datos locales', {
        message: err?.message,
      });
      this.#app = null;
      this.#db = null;
      this.#configured = false;
    }
  }

  /** @returns {boolean} */
  get isConfigured() {
    return this.#configured;
  }

  /** @returns {import('firebase/firestore').Firestore|null} */
  get db() {
    return this.#db;
  }
}
