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
import { SimulationMapper } from '../application/mappers/SimulationMapper.js';
import { ListCreditProductsUseCase } from '../application/usecases/ListCreditProductsUseCase.js';
import { SearchCreditProductsUseCase } from '../application/usecases/SearchCreditProductsUseCase.js';
import { GetAmountRangeFiltersUseCase } from '../application/usecases/GetAmountRangeFiltersUseCase.js';
import { GetCreditProductNamesUseCase } from '../application/usecases/GetCreditProductNamesUseCase.js';
import { SimulateCreditUseCase } from '../application/usecases/SimulateCreditUseCase.js';
import { SubmitCreditApplicationUseCase } from '../application/usecases/SubmitCreditApplicationUseCase.js';

/* ---------- Infraestructura (adaptadores) ---------- */
import { InMemoryCreditProductRepository } from '../infrastructure/persistence/InMemoryCreditProductRepository.js';
import { LocalStorageCreditApplicationRepository } from '../infrastructure/persistence/LocalStorageCreditApplicationRepository.js';
import { StaticAmountRangeProvider } from '../infrastructure/persistence/StaticAmountRangeProvider.js';
import { IntlMoneyFormatter } from '../infrastructure/formatters/IntlMoneyFormatter.js';
import { SystemClock } from '../infrastructure/time/SystemClock.js';
import { CryptoIdGenerator } from '../infrastructure/identity/CryptoIdGenerator.js';
import { ConsoleLogger } from '../infrastructure/logging/ConsoleLogger.js';
import { ToastNotifier } from '../infrastructure/notification/ToastNotifier.js';
import { STATIC_TERM_OPTIONS } from '../infrastructure/persistence/datasources/StaticCreditProductDataSource.js';

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

  /* ============================================================
     2. Persistencia (adaptadores de puertos del dominio)
     ============================================================ */
  container.register('productRepository', () =>
    assertImplements(new InMemoryCreditProductRepository(), ICreditProductRepository),
  );

  container.register('amountRangeProvider', () =>
    assertImplements(new StaticAmountRangeProvider(), IAmountRangeProvider),
  );

  container.register('applicationRepository', (c) =>
    assertImplements(
      new LocalStorageCreditApplicationRepository({ idGenerator: c.resolve('idGenerator') }),
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

  return container;
}
