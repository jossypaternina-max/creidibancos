import { Container } from './Container.js';
import { AppConfig } from './AppConfig.js';

/* ---------- Dominio (contratos) ---------- */
import { assertImplements } from '../domain/contracts/Contract.js';
import { ICreditProductRepository } from '../domain/contracts/ICreditProductRepository.js';
import { ICreditApplicationRepository } from '../domain/contracts/ICreditApplicationRepository.js';
import { IAmountRangeProvider } from '../domain/contracts/IAmountRangeProvider.js';
import { IMoneyFormatter } from '../domain/contracts/IMoneyFormatter.js';
import { IClock } from '../domain/contracts/IClock.js';
import { IIdGenerator } from '../domain/contracts/IIdGenerator.js';

/* ---------- Aplicación ---------- */
import { ILogger } from '../application/contracts/ILogger.js';
import { INotifier } from '../application/contracts/INotifier.js';
import { CreditProductMapper } from '../application/mappers/CreditProductMapper.js';
import { CreditApplicationMapper } from '../application/mappers/CreditApplicationMapper.js';
import { SimulationMapper } from '../application/mappers/SimulationMapper.js';
import { ListCreditProductsUseCase } from '../application/usecases/ListCreditProductsUseCase.js';
import { SearchCreditProductsUseCase } from '../application/usecases/SearchCreditProductsUseCase.js';
import { GetAmountRangeFiltersUseCase } from '../application/usecases/GetAmountRangeFiltersUseCase.js';
import { GetCreditProductNamesUseCase } from '../application/usecases/GetCreditProductNamesUseCase.js';
import { SimulateCreditUseCase } from '../application/usecases/SimulateCreditUseCase.js';
import { SubmitCreditApplicationUseCase } from '../application/usecases/SubmitCreditApplicationUseCase.js';
import { ValidateCreditApplicationDraftUseCase } from '../application/usecases/ValidateCreditApplicationDraftUseCase.js';
import { ListMyApplicationsUseCase } from '../application/usecases/ListMyApplicationsUseCase.js';

/* ---------- Infraestructura (adaptadores) ---------- */
import { FirebaseClient } from '../infrastructure/firebase/FirebaseClient.js';
import { FirestoreCreditProductRepository } from '../infrastructure/persistence/FirestoreCreditProductRepository.js';
import { FirestoreCreditApplicationRepository } from '../infrastructure/persistence/FirestoreCreditApplicationRepository.js';
import { StaticAmountRangeProvider } from '../infrastructure/persistence/StaticAmountRangeProvider.js';
import { IntlMoneyFormatter } from '../infrastructure/formatters/IntlMoneyFormatter.js';
import { SystemClock } from '../infrastructure/time/SystemClock.js';
import { CryptoIdGenerator } from '../infrastructure/identity/CryptoIdGenerator.js';
import { ConsoleLogger } from '../infrastructure/logging/ConsoleLogger.js';
import { ToastNotifier } from '../infrastructure/notification/ToastNotifier.js';
import { STATIC_TERM_OPTIONS } from '../infrastructure/persistence/datasources/StaticCreditProductDataSource.js';

/**
 * Configuración de Firebase leída de las variables de entorno de Vite
 * (`import.meta.env.VITE_FIREBASE_*`). Se lee AQUÍ, en el composition root, y
 * se inyecta por constructor a `FirebaseClient`: ninguna otra clase lee
 * configuración global. Las credenciales nunca están en el código: viven en
 * `.env` (ignorado por git); `.env.example` documenta las claves.
 *
 * @returns {Object}
 */
function readFirebaseConfig() {
  const env = import.meta.env ?? {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  };
}

/**
 * buildContainer — COMPOSITION ROOT.
 *
 * El único lugar del proyecto donde se hace `new` de una clase concreta y donde
 * se conocen simultáneamente las capas. Cambiar un adaptador (por ejemplo,
 * pasar de `InMemoryCreditProductRepository` a uno HTTP) es cambiar una línea
 * AQUÍ; ni el dominio ni la interfaz se enteran.
 *
 * El grafo se declara de dentro hacia fuera:
 *   dominio ← infraestructura ← aplicación
 *
 * La presentación NO se registra aquí. En la Actividad 1 el contenedor
 * construía además vistas, controladores y router; en la Actividad 2 esa parte
 * la construye React, que solo recibe los casos de uso a través de
 * `DependenciesProvider`. Ahí está toda la diferencia entre las dos entregas:
 * el hexágono no cambió, cambió el adaptador de interfaz.
 *
 * @param {{ config?: typeof AppConfig, notificationsElement?: HTMLElement|null }} [options]
 * @returns {Container}
 */
export function buildContainer({ config = AppConfig, notificationsElement = null } = {}) {
  const container = new Container();

  /* ============================================================
     0. Valores de arranque
     ============================================================ */
  container.registerValue('config', config);
  container.registerValue(
    'notificationsElement',
    notificationsElement ?? document.querySelector(config.selectors.notifications),
  );
  container.registerValue('termOptions', STATIC_TERM_OPTIONS);

  /* ============================================================
     1. Adaptadores técnicos (infraestructura)
     ============================================================ */
  container.register('logger', (c) =>
    assertImplements(
      new ConsoleLogger({
        level: c.resolve('config').logLevel,
        prefix: c.resolve('config').appName,
      }),
      ILogger,
    ),
  );

  container.register('notifier', (c) =>
    assertImplements(
      new ToastNotifier({
        container: c.resolve('notificationsElement'),
        timeoutMs: c.resolve('config').toastTimeoutMs,
      }),
      INotifier,
    ),
  );

  container.register('clock', () => assertImplements(new SystemClock(), IClock));

  container.register('idGenerator', () =>
    assertImplements(new CryptoIdGenerator(), IIdGenerator),
  );

  container.register('moneyFormatter', (c) =>
    assertImplements(
      new IntlMoneyFormatter({
        locale: c.resolve('config').locale,
        currency: c.resolve('config').currency,
      }),
      IMoneyFormatter,
    ),
  );

  /* Cliente de Firebase: recurso técnico compartido (como la conexión a una
     base de datos). No implementa ningún puerto, así que no lleva
     `assertImplements`. Si faltan credenciales, degrada solo. */
  container.register(
    'firebaseClient',
    (c) =>
      new FirebaseClient({
        config: readFirebaseConfig(),
        logger: c.resolve('logger'),
      }),
  );

  /* ============================================================
     2. Persistencia (adaptadores de puertos del dominio)

     Productos y solicitudes se persisten en Cloud Firestore. El cambio
     respecto a la Actividad 2 vive SOLO aquí: el dominio, la aplicación y la
     interfaz no se enteran de que la fuente pasó de estática/localStorage a
     Firestore. Si Firebase no está configurado, ambos adaptadores degradan a
     datos locales.
     ============================================================ */
  container.register('productRepository', (c) =>
    assertImplements(
      new FirestoreCreditProductRepository({
        firebaseClient: c.resolve('firebaseClient'),
        logger: c.resolve('logger'),
      }),
      ICreditProductRepository,
    ),
  );

  container.register('amountRangeProvider', () =>
    assertImplements(new StaticAmountRangeProvider(), IAmountRangeProvider),
  );

  container.register('applicationRepository', (c) =>
    assertImplements(
      new FirestoreCreditApplicationRepository({
        firebaseClient: c.resolve('firebaseClient'),
        idGenerator: c.resolve('idGenerator'),
        logger: c.resolve('logger'),
      }),
      ICreditApplicationRepository,
    ),
  );

  /* ============================================================
     3. Aplicación (mappers + casos de uso)
     ============================================================ */
  container.register(
    'productMapper',
    (c) => new CreditProductMapper({ moneyFormatter: c.resolve('moneyFormatter') }),
  );

  container.register(
    'simulationMapper',
    (c) => new SimulationMapper({ moneyFormatter: c.resolve('moneyFormatter') }),
  );

  container.register(
    'applicationMapper',
    (c) => new CreditApplicationMapper({ moneyFormatter: c.resolve('moneyFormatter') }),
  );

  container.register(
    'listCreditProductsUseCase',
    (c) =>
      new ListCreditProductsUseCase({
        productRepository: c.resolve('productRepository'),
        productMapper: c.resolve('productMapper'),
      }),
  );

  container.register(
    'searchCreditProductsUseCase',
    (c) =>
      new SearchCreditProductsUseCase({
        productRepository: c.resolve('productRepository'),
        productMapper: c.resolve('productMapper'),
        amountRangeProvider: c.resolve('amountRangeProvider'),
      }),
  );

  container.register(
    'getAmountRangeFiltersUseCase',
    (c) =>
      new GetAmountRangeFiltersUseCase({
        amountRangeProvider: c.resolve('amountRangeProvider'),
      }),
  );

  container.register(
    'getCreditProductNamesUseCase',
    (c) =>
      new GetCreditProductNamesUseCase({
        productRepository: c.resolve('productRepository'),
      }),
  );

  container.register(
    'simulateCreditUseCase',
    (c) =>
      new SimulateCreditUseCase({
        productRepository: c.resolve('productRepository'),
        simulationMapper: c.resolve('simulationMapper'),
      }),
  );

  container.register(
    'submitCreditApplicationUseCase',
    (c) =>
      new SubmitCreditApplicationUseCase({
        applicationRepository: c.resolve('applicationRepository'),
        productRepository: c.resolve('productRepository'),
        clock: c.resolve('clock'),
        logger: c.resolve('logger'),
      }),
  );

  container.register(
    'validateCreditApplicationDraftUseCase',
    () => new ValidateCreditApplicationDraftUseCase(),
  );

  container.register(
    'listMyApplicationsUseCase',
    (c) =>
      new ListMyApplicationsUseCase({
        applicationRepository: c.resolve('applicationRepository'),
        applicationMapper: c.resolve('applicationMapper'),
      }),
  );

  return container;
}
