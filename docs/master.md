# CreditSmart — Documentación Maestra

> Índice único de toda la documentación del proyecto.
> Reconstrucción de `sweet-smart-credit-path.base44.app` con **arquitectura
> hexagonal**, **Clean Architecture**, **SOLID** e **interfaces declaradas como
> contratos**.
>
> **Actividad 1**: interfaz en JavaScript vanilla, sin build (tag `ev1-entrega`).
> **Actividad 2**: la misma arquitectura con la interfaz en **React + Vite +
> React Router**. El delta está en
> [21 — Migración a React](./21-migracion-a-react-ev2.md); los documentos 01–20
> describen el diseño, que no cambió.

| Dato | Valor |
|---|---|
| Ubicación | `C:\laragon\www\crediSmart` |
| Stack | React 19 · React Router 7 · Vite 8 · CSS3 plano · JavaScript ES2022 |
| Dependencias de runtime | React y React Router. Dominio, aplicación e infraestructura siguen sin ninguna |
| Capas | `domain` · `application` · `infrastructure` · presentación React (+ `config`, `data`) |
| Archivos JS/JSX | 96 — `domain` 26 · presentación 38 (`components` 21 · `hooks` 8 · `pages` 6 · `context` 1 · `App` · `main`) · `application` 16 · `infrastructure` 10 · `config` 5 · `data` 1 |
| Archivos CSS | 7 en cascada explícita — rediseñados por completo en la Actividad 2, con tema claro/oscuro/automático ([23](./23-rediseno-ui-ux.md)) |
| Contratos (interfaces) | 9 puertos de dominio y aplicación (los 3 de presentación los impone React) |
| Casos de uso | 7 |
| Entidades | 2 · Value objects: 10 |
| Productos del catálogo | 6 (5 replicados del original + `Crédito de Libranza`) |
| Paletas de tema | 6 declaradas en el dominio (`blue` · `emerald` · `violet` · `amber` · `rose` · `teal`), las seis resueltas al azul corporativo en la interfaz. El pictograma y el tono de cada producto los fija `config/productVisualMap.js` ([23 §4](./23-rediseno-ui-ux.md)) |
| Adaptadores | 10 · Servicios de dominio: 2 |
| Dependencias en el contenedor | 20 (la presentación la construye React) |
| Rutas | `/` · `/productos` · `/simulador` · `/solicitar` · `/ayuda` · `*` (404) |

---

## 1. Cómo leer esta documentación

Tres itinerarios según para qué vengas:

### Itinerario A — Entender el diseño (lectura conceptual, ~40 min)

```
01 Visión general
   ↓
02 Arquitectura hexagonal      ¿qué es un puerto? ¿un adaptador?
   ↓
03 Clean Architecture / capas  ¿quién puede importar a quién?
   ↓
04 MVC en presentación         ¿dónde está el modelo, la vista, el controlador?
   ↓
05 Principios SOLID            los 5, con el código real del proyecto
   ↓
16 Catálogo de patrones        los 14 patrones aplicados, y por qué
```

### Itinerario B — Tocar código (lectura de referencia)

```
06 Contratos e interfaces      cómo se declaran interfaces en JavaScript
07 Entidades                   CreditProduct · CreditApplication
08 Value objects               Money · Term · AmountRange · …
09 Servicios, criterios, errores
10 Casos de uso y DTOs
11 Adaptadores de infraestructura
12 Vistas, controladores y componentes
13 Inyección de dependencias
14 Enrutado y URLs
15 Sistema de estilos
```

### Itinerario C — Hacer un cambio ya (lectura operativa)

```
18 Guía de extensión           recetas paso a paso
17 Flujos end-to-end           qué pasa exactamente en cada interacción
19 Pruebas y verificación      cómo comprobar que no rompiste nada
```

---

## 2. Directorio de documentos

### Fundamentos del diseño

| # | Documento | Qué responde |
|---|---|---|
| 01 | [Visión general](./01-vision-general.md) | Qué es el proyecto, qué se replicó del original, mapa completo del sistema, cómo ejecutarlo |
| 02 | [Arquitectura hexagonal](./02-arquitectura-hexagonal.md) | Puertos y adaptadores, driving vs. driven, el diagrama del hexágono, los 12 puertos del proyecto |
| 03 | [Clean Architecture y capas](./03-clean-architecture-capas.md) | Las 4 capas + config, la regla de dependencia, cómo se verifica con `grep`, flujo de control vs. flujo de dependencias |
| 04 | [MVC en la presentación](./04-mvc-presentacion.md) | Dónde vive el Modelo (no en la vista), qué puede y no puede hacer una Vista, qué puede y no puede hacer un Controlador. **En React**: Vista → `pages/`, Controlador → `hooks/` ([21](./21-migracion-a-react-ev2.md)) |
| 05 | [Principios SOLID](./05-principios-solid.md) | Los 5 principios, cada uno con el archivo y el fragmento real que lo materializa |

### Contratos

| # | Documento | Qué responde |
|---|---|---|
| 06 | [Contratos e interfaces](./06-contratos-e-interfaces.md) | Cómo se simulan `interface` en JavaScript, `defineContract`, `assertImplements`, catálogo de los 12 contratos con su firma completa |

### Dominio (el núcleo)

| # | Documento | Qué responde |
|---|---|---|
| 07 | [Entidades](./07-entidades.md) | `CreditProduct` y `CreditApplication`: invariantes, identidad, comportamiento, máquina de estados |
| 08 | [Value objects](./08-value-objects.md) | Los 10 value objects, por qué son inmutables, por qué se auto-validan, aritmética de `Money`, solape de `AmountRange` |
| 09 | [Servicios, criterios y errores](./09-dominio-servicios-criterios-errores.md) | `CreditApplicationPolicy`, `ProductSearchCriteria` (Specification), jerarquía de los 4 errores de dominio |

### Aplicación (casos de uso)

| # | Documento | Qué responde |
|---|---|---|
| 10 | [Casos de uso y DTOs](./10-casos-de-uso-y-dtos.md) | Los 6 casos de uso, el tipo `Result`, los mappers, por qué la vista recibe DTOs y no entidades |

### Infraestructura y presentación

| # | Documento | Qué responde |
|---|---|---|
| 11 | [Adaptadores de infraestructura](./11-adaptadores-de-infraestructura.md) | Los 10 adaptadores, el datasource estático, la anticorruption layer, cómo sustituir cualquiera por uno HTTP |
| 12 | [Vistas, controladores y componentes](./12-vistas-controladores-componentes.md) | `BaseView`, `BaseController`, las 6 vistas, los 4 componentes, el escapado por defecto, la gestión de listeners. **Histórico de la Actividad 1**: sustituido por [21](./21-migracion-a-react-ev2.md) |
| 13 | [Inyección de dependencias](./13-inyeccion-de-dependencias.md) | El `Container`, el Composition Root, el grafo de dependencias, detección de ciclos. **En React**: `DependenciesProvider` ([21 §3](./21-migracion-a-react-ev2.md)) |
| 14 | [Enrutado y URLs](./14-enrutado-y-urls.md) | `HistoryRouter`, `UrlBuilder`, prefijo de despliegue, delegación de clics, reescritura en Apache/Nginx. **En React**: React Router ([21 §2](./21-migracion-a-react-ev2.md)) |
| 15 | [Sistema de estilos](./15-sistema-de-estilos.md) | Los 7 archivos CSS en cascada, los design tokens, el mapeo Tailwind → CSS plano, los temas de producto. **Sistema actual**: [23](./23-rediseno-ui-ux.md) |

### Síntesis y operación

| # | Documento | Qué responde |
|---|---|---|
| 16 | [Catálogo de patrones](./16-catalogo-de-patrones.md) | Los 14 patrones de diseño usados (+4 menores): qué problema resuelve cada uno, dónde está, y qué pasaría sin él |
| 17 | [Flujos end-to-end](./17-flujos-end-to-end.md) | Diagramas de secuencia: arranque, cargar catálogo, filtrar en el simulador, radicar una solicitud, 404 |
| 18 | [Guía de extensión](./18-guia-de-extension.md) | 10 recetas paso a paso: añadir producto, campo, página, adaptador HTTP, contrato nuevo… |
| 19 | [Pruebas y verificación](./19-pruebas-y-verificacion.md) | Las suites ejecutadas, qué cubre cada una, cómo re-ejecutarlas, qué verificar antes de dar por bueno un cambio. **Prueba de arranque de la interfaz**: [23 §13](./23-rediseno-ui-ux.md) |
| 20 | [Glosario y convenciones](./20-glosario-y-convenciones.md) | Vocabulario del proyecto, convenciones de nombres, de archivos, de comentarios y de commits |
| 21 | [Migración a React (Actividad 2)](./21-migracion-a-react-ev2.md) | Qué cambió y qué no al sustituir la interfaz vanilla por React: tabla de equivalencias, inyección con contexto, los 3 cambios que exigió, verificación |
| 22 | [Identidad visual](./22-identidad-visual.md) | La paleta corporativa de tres colores, por qué se retiraron los seis degradados de producto, y qué comprobar antes de dar por buena una pantalla nueva |
| 23 | [Rediseño UI/UX](./23-rediseno-ui-ux.md) | La aplicación del kit de rediseño: tokens con tema día/noche, el set de iconos propio, las cinco pantallas, el puente simulador → solicitud, y qué se decidió NO pintar del mockup y por qué |
| 24 | [Integración con Firebase (Actividad 3)](./24-integracion-firebase-ev3.md) | De memoria a Firestore: `FirebaseClient`, los repos de Firestore (CRUD con `addDoc`/`getDocs`/`where`+`orderBy`), la página *Mis solicitudes*, las variables de entorno, la degradación y el manejo de errores |

---

## 3. Mapa de una decisión: "¿dónde pongo este código?"

Árbol de decisión rápido. La respuesta larga está en
[03 — Clean Architecture y capas](./03-clean-architecture-capas.md).

```
¿Es una regla que seguiría siendo verdad sin navegador, sin base de datos
 y sin pantalla?
 ├─ SÍ, y habla de UN solo concepto ................. domain/entities
 │                                    o domain/valueobjects (si es inmutable
 │                                      y se compara por valor)
 ├─ SÍ, y cruza DOS o más conceptos ................. domain/services
 └─ SÍ, y es un criterio de selección ............... domain/criteria

¿Es "el sistema debe poder hacer X" (un caso de uso completo)?
 └─ SÍ .............................................. application/usecases

¿Habla de una tecnología concreta (fetch, localStorage, Intl, DOM, crypto)?
 └─ SÍ .............................................. infrastructure/…
     y debe implementar un puerto ya declarado en domain/ o application/

¿Pinta píxeles? .................................... src/components (puro, sin
                                                      estado ni efectos)
                                                   o src/pages (una ruta)

¿Guarda estado de interfaz o invoca un caso de uso?
 └─ SÍ .............................................. src/hooks

¿Es un dato del catálogo? .......................... src/data/creditsData.js

¿Es un `new` de una clase concreta que une capas?
 └─ SÍ ......... config/dependencies.js  ← y SOLO ahí
```

---

## 4. Reglas no negociables

Las cinco reglas que definen esta arquitectura. Romper cualquiera invalida el
diseño, no solo "empeora el estilo".

1. **`src/domain/` no importa nada de fuera de `src/domain/`.**
   Ni aplicación, ni infraestructura, ni presentación, ni config.
2. **`src/application/` solo importa de `src/domain/` y de sí misma.**
3. **La presentación (`src/components`, `src/pages`, `src/hooks`,
   `src/context`) nunca importa `src/infrastructure/`.** Si necesita un dato
   de infraestructura, lo recibe **inyectado** por `DependenciesProvider`.
4. **El único archivo con `new` de clases concretas de varias capas es
   `src/config/dependencies.js`** (el Composition Root).
5. **Toda dependencia entra por el constructor.** No hay `import` de
   singletons, ni estado global mutable, ni Service Locator dentro de las
   clases.

Verificación de las tres primeras:

```bash
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)"              src/application/
grep -rn "infrastructure" src/components src/pages src/hooks src/context src/App.jsx
```

Las tres deben devolver **cero resultados**. Estado actual: **cero**.

---

## 5. Índice alfabético de artefactos

Dónde está declarado cada nombre propio del proyecto.

| Artefacto | Tipo | Archivo | Doc |
|---|---|---|---|
| `Alert` | Componente React | `src/components/Alert.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `AmortizationPlan` | Value object | `src/domain/valueobjects/AmortizationPlan.js` | [08](./08-value-objects.md) |
| `AmortizationTable` | Componente React | `src/components/AmortizationTable.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `AmountRange` | Value object | `src/domain/valueobjects/AmountRange.js` | [08](./08-value-objects.md) |
| `AmountRangeFilter` | Componente React | `src/components/AmountRangeFilter.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `App` | Tabla de rutas | `src/App.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `AppConfig` | Configuración | `src/config/AppConfig.js` | [13](./13-inyeccion-de-dependencias.md) |
| `Applicant` | Value object | `src/domain/valueobjects/Applicant.js` | [08](./08-value-objects.md) |
| `APPLICATION_STATUS` | Enum | `src/domain/entities/CreditApplication.js` | [07](./07-entidades.md) |
| `ApplicationPage` | Página React | `src/pages/ApplicationPage.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `ApplicationStepper` | Componente | `src/components/ApplicationStepper.jsx` | [23](./23-rediseno-ui-ux.md) |
| `ApplicationSummary` | Componente | `src/components/ApplicationSummary.jsx` | [23](./23-rediseno-ui-ux.md) |
| `assertImplements` | Función | `src/domain/contracts/Contract.js` | [06](./06-contratos-e-interfaces.md) |
| `Breadcrumb` | Componente | `src/components/Breadcrumb.jsx` | [23](./23-rediseno-ui-ux.md) |
| `buildContainer` | Composition Root | `src/config/dependencies.js` | [13](./13-inyeccion-de-dependencias.md) |
| `CatalogFilters` | Componente | `src/components/CatalogFilters.jsx` | [23](./23-rediseno-ui-ux.md) |
| `ConsoleLogger` | Adaptador | `src/infrastructure/logging/ConsoleLogger.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `Container` | Contenedor DI | `src/config/Container.js` | [13](./13-inyeccion-de-dependencias.md) |
| `Contract.js` | Fábrica de interfaces | `src/domain/contracts/Contract.js` | [06](./06-contratos-e-interfaces.md) |
| `ContractViolationError` | Error | `src/domain/errors/ContractViolationError.js` | [09](./09-dominio-servicios-criterios-errores.md) |
| `CreditApplication` | Entidad | `src/domain/entities/CreditApplication.js` | [07](./07-entidades.md) |
| `CreditApplicationDTO` | DTO | `src/application/dto/CreditApplicationDTO.js` | [24](./24-integracion-firebase-ev3.md) |
| `CreditApplicationFactory` | Factory / ACL | `src/infrastructure/persistence/factories/CreditApplicationFactory.js` | [24](./24-integracion-firebase-ev3.md) |
| `CreditApplicationMapper` | Mapper | `src/application/mappers/CreditApplicationMapper.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `CreditApplicationPolicy` | Servicio de dominio | `src/domain/services/CreditApplicationPolicy.js` | [09](./09-dominio-servicios-criterios-errores.md) |
| `CreditCard` | Componente React | `src/components/CreditCard.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `CreditProduct` | Entidad | `src/domain/entities/CreditProduct.js` | [07](./07-entidades.md) |
| `CreditProductDTO` | DTO | `src/application/dto/CreditProductDTO.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `CreditProductFactory` | Factory / ACL | `src/infrastructure/persistence/factories/CreditProductFactory.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `CreditProductMapper` | Mapper | `src/application/mappers/CreditProductMapper.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `CREDITS_DATA` | Datos | `src/data/creditsData.js` | [11](./11-adaptadores-de-infraestructura.md) · [21](./21-migracion-a-react-ev2.md) |
| `CreditSimulationService` | Servicio de dominio | `src/domain/services/CreditSimulationService.js` | [09](./09-dominio-servicios-criterios-errores.md) |
| `CryptoIdGenerator` | Adaptador | `src/infrastructure/identity/CryptoIdGenerator.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `defineContract` | Función | `src/domain/contracts/Contract.js` | [06](./06-contratos-e-interfaces.md) |
| `DependenciesProvider` | Contexto React | `src/context/DependenciesProvider.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `DomainError` | Error base | `src/domain/errors/DomainError.js` | [09](./09-dominio-servicios-criterios-errores.md) |
| `EmploymentInfo` | Value object | `src/domain/valueobjects/EmploymentInfo.js` | [08](./08-value-objects.md) |
| `Footer` | Componente React | `src/components/Footer.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `FirebaseClient` | Recurso técnico | `src/infrastructure/firebase/FirebaseClient.js` | [24](./24-integracion-firebase-ev3.md) |
| `FirestoreCreditApplicationRepository` | Adaptador | `src/infrastructure/persistence/FirestoreCreditApplicationRepository.js` | [24](./24-integracion-firebase-ev3.md) |
| `FirestoreCreditProductRepository` | Adaptador | `src/infrastructure/persistence/FirestoreCreditProductRepository.js` | [24](./24-integracion-firebase-ev3.md) |
| `FormField` | Componente React | `src/components/FormField.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `GetAmountRangeFiltersUseCase` | Caso de uso | `src/application/usecases/GetAmountRangeFiltersUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `GetCreditProductNamesUseCase` | Caso de uso | `src/application/usecases/GetCreditProductNamesUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `GoalPanel` | Componente | `src/components/GoalPanel.jsx` | [23](./23-rediseno-ui-ux.md) |
| `HelpPage` | Página | `src/pages/HelpPage.jsx` | [23](./23-rediseno-ui-ux.md) |
| `HomePage` | Página | `src/pages/HomePage.jsx` | [23](./23-rediseno-ui-ux.md) |
| `IAmountRangeProvider` | Puerto | `src/domain/contracts/IAmountRangeProvider.js` | [06](./06-contratos-e-interfaces.md) |
| `IClock` | Puerto | `src/domain/contracts/IClock.js` | [06](./06-contratos-e-interfaces.md) |
| `Icon` | Componente | `src/components/Icon.jsx` | [23](./23-rediseno-ui-ux.md) |
| `ICreditApplicationRepository` | Puerto | `src/domain/contracts/ICreditApplicationRepository.js` | [06](./06-contratos-e-interfaces.md) |
| `ICreditProductRepository` | Puerto | `src/domain/contracts/ICreditProductRepository.js` | [06](./06-contratos-e-interfaces.md) |
| `IIdGenerator` | Puerto | `src/domain/contracts/IIdGenerator.js` | [06](./06-contratos-e-interfaces.md) |
| `ILogger` | Puerto | `src/application/contracts/ILogger.js` | [06](./06-contratos-e-interfaces.md) |
| `IMoneyFormatter` | Puerto | `src/domain/contracts/IMoneyFormatter.js` | [06](./06-contratos-e-interfaces.md) |
| `InMemoryCreditProductRepository` | Adaptador (legado, sin cablear en EV3) | `src/infrastructure/persistence/InMemoryCreditProductRepository.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `INotifier` | Puerto | `src/application/contracts/INotifier.js` | [06](./06-contratos-e-interfaces.md) |
| `Installment` | Value object | `src/domain/valueobjects/Installment.js` | [08](./08-value-objects.md) |
| `InterestRate` | Value object | `src/domain/valueobjects/InterestRate.js` | [08](./08-value-objects.md) |
| `IntlMoneyFormatter` | Adaptador | `src/infrastructure/formatters/IntlMoneyFormatter.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `IUseCase` | Puerto | `src/application/contracts/IUseCase.js` | [06](./06-contratos-e-interfaces.md) |
| `ListCreditProductsUseCase` | Caso de uso | `src/application/usecases/ListCreditProductsUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `ListMyApplicationsUseCase` | Caso de uso | `src/application/usecases/ListMyApplicationsUseCase.js` | [24](./24-integracion-firebase-ev3.md) |
| `LocalStorageCreditApplicationRepository` | Adaptador (respaldo) | `src/infrastructure/persistence/LocalStorageCreditApplicationRepository.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `Logo` | Componente | `src/components/Logo.jsx` | [23](./23-rediseno-ui-ux.md) |
| `MyApplicationsPage` | Página | `src/pages/MyApplicationsPage.jsx` | [24](./24-integracion-firebase-ev3.md) |
| `main.jsx` | Composition Root | `src/main.jsx` | [13](./13-inyeccion-de-dependencias.md) · [21](./21-migracion-a-react-ev2.md) |
| `Money` | Value object | `src/domain/valueobjects/Money.js` | [08](./08-value-objects.md) |
| `Navbar` | Componente React | `src/components/Navbar.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `NotFoundPage` | Página React | `src/pages/NotFoundPage.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `NotImplementedError` | Error | `src/domain/errors/NotImplementedError.js` | [09](./09-dominio-servicios-criterios-errores.md) |
| `ProductSearchCriteria` | Specification | `src/domain/criteria/ProductSearchCriteria.js` | [09](./09-dominio-servicios-criterios-errores.md) |
| `ProductsPage` | Página | `src/pages/ProductsPage.jsx` | [23](./23-rediseno-ui-ux.md) |
| `ProductTheme` | Value object | `src/domain/valueobjects/ProductTheme.js` | [08](./08-value-objects.md) |
| `ProductTile` | Componente | `src/components/ProductTile.jsx` | [23](./23-rediseno-ui-ux.md) |
| `productVisualMap` | Configuración | `src/config/productVisualMap.js` | [23](./23-rediseno-ui-ux.md) |
| `RequestedCredit` | Value object | `src/domain/valueobjects/RequestedCredit.js` | [08](./08-value-objects.md) |
| `Result` | Tipo de retorno | `src/application/shared/Result.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `ROUTES` / `ROUTE_TITLES` | Configuración | `src/config/routes.js` | [14](./14-enrutado-y-urls.md) · [21](./21-migracion-a-react-ev2.md) |
| `SearchBar` | Componente React | `src/components/SearchBar.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `SearchCreditProductsUseCase` | Caso de uso | `src/application/usecases/SearchCreditProductsUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `SecurityPanel` | Componente | `src/components/SecurityPanel.jsx` | [23](./23-rediseno-ui-ux.md) |
| `SimulateCreditUseCase` | Caso de uso | `src/application/usecases/SimulateCreditUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `SimulationDTO` | DTO | `src/application/dto/SimulationDTO.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `SimulationMapper` | Mapper | `src/application/mappers/SimulationMapper.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `SimulationResult` | Componente React | `src/components/SimulationResult.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `SimulatorForm` | Componente React | `src/components/SimulatorForm.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `SimulatorPage` | Página React | `src/pages/SimulatorPage.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `SortSelect` | Componente React | `src/components/SortSelect.jsx` | [21](./21-migracion-a-react-ev2.md) |
| `Spinner` | Componente React | `src/components/Spinner.jsx` | [24](./24-integracion-firebase-ev3.md) |
| `StaticAmountRangeProvider` | Adaptador | `src/infrastructure/persistence/StaticAmountRangeProvider.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `StaticCreditProductDataSource` | Datasource | `src/infrastructure/persistence/datasources/StaticCreditProductDataSource.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `SubmitCreditApplicationUseCase` | Caso de uso | `src/application/usecases/SubmitCreditApplicationUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) |
| `SystemClock` | Adaptador | `src/infrastructure/time/SystemClock.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `Term` | Value object | `src/domain/valueobjects/Term.js` | [08](./08-value-objects.md) |
| `ThemeToggle` | Componente | `src/components/ThemeToggle.jsx` | [23](./23-rediseno-ui-ux.md) |
| `ToastNotifier` | Adaptador | `src/infrastructure/notification/ToastNotifier.js` | [11](./11-adaptadores-de-infraestructura.md) |
| `useApplicationForm` | Hook | `src/hooks/useApplicationForm.js` | [21](./21-migracion-a-react-ev2.md) |
| `useCatalogRefinement` | Hook | `src/hooks/useCatalogRefinement.js` | [23](./23-rediseno-ui-ux.md) |
| `useCreditProducts` | Hook | `src/hooks/useCreditProducts.js` | [21](./21-migracion-a-react-ev2.md) |
| `useCreditSearch` | Hook | `src/hooks/useCreditSearch.js` | [21](./21-migracion-a-react-ev2.md) |
| `useDependencies` | Hook | `src/hooks/useDependencies.js` | [21](./21-migracion-a-react-ev2.md) |
| `useDocumentTitle` | Hook | `src/hooks/useDocumentTitle.js` | [21](./21-migracion-a-react-ev2.md) |
| `useMyApplications` | Hook | `src/hooks/useMyApplications.js` | [24](./24-integracion-firebase-ev3.md) |
| `useProductSorting` | Hook | `src/hooks/useProductSorting.js` | [21](./21-migracion-a-react-ev2.md) |
| `useSimulation` | Hook | `src/hooks/useSimulation.js` | [21](./21-migracion-a-react-ev2.md) |
| `ValidateCreditApplicationDraftUseCase` | Caso de uso | `src/application/usecases/ValidateCreditApplicationDraftUseCase.js` | [10](./10-casos-de-uso-y-dtos.md) · [21](./21-migracion-a-react-ev2.md) |
| `ValidationError` | Error | `src/domain/errors/ValidationError.js` | [09](./09-dominio-servicios-criterios-errores.md) |

---

## 5 bis. Qué cambió en el rediseño de la interfaz

Detalle completo en [23 — Rediseño UI/UX](./23-rediseno-ui-ux.md).

| Capa | Archivo | Cambio |
|---|---|---|
| Estilos | `02-tokens.css` | Reescrito: tres modos de tema, aliases semánticos, `--photo-dim`, `--chip-*` |
| Estilos | `03` · `04` · `05` · `06` · `07` | Reescritos sobre esos tokens |
| Presentación | `components/Icon.jsx` | **nuevo** — 36 trazos inline con `currentColor` |
| Presentación | `components/ThemeToggle.jsx` | **nuevo** — claro / oscuro, recordado en `localStorage` |
| Presentación | `pages/HomePage.jsx` · `ProductsPage.jsx` · `HelpPage.jsx` | **nuevos** — sustituyen a `CatalogPage` y añaden dos rutas |
| Presentación | `components/ApplicationStepper.jsx` + 6 componentes más | **nuevos** — pasos, resumen, seguridad, filtros, accesos, migas |
| Presentación | `hooks/useCatalogRefinement.js` | **nuevo** — filtros de tipo y plazo, decisión de interfaz |
| Config | `config/productVisualMap.js` | **nuevo** — pictograma y frase corta por producto, fuera del dominio |
| Config | `config/routes.js` | 3 rutas → 5 + comodín; `NAV_ITEMS` y `PREFILL_PARAMS` |
| Presentación | `context/DependenciesProvider.jsx` | **única línea fuera de presentación**: expone el puerto `IMoneyFormatter` |
| Pruebas | `tests/02-boot-jsdom.mjs` | **nuevo** — monta las 7 rutas en un DOM simulado |

**Cero cambios de comportamiento en `domain/`, `application/` e
`infrastructure/`.** Ningún contrato nuevo, ningún caso de uso nuevo, ningún
endpoint. Todo el estado que añadió el rediseño —tema, paso del formulario,
filtros de interfaz, prellenado— vive en presentación.

---

## 6. Documentos relacionados fuera de `docs/`

| Archivo | Contenido |
|---|---|
| `../README.md` | Puesta en marcha, qué se replicó del sitio original, resumen de arquitectura |
| `../public/.htaccess` | Reescritura SPA para Apache/Laragon, MIME, caché, cabeceras |
| `../src/config/AppConfig.js` | Todos los valores configurables del sistema |
| `./iudigital_doc/EV1/CreditSmart_Arquitectura_EV1.docx` | Documento de arquitectura entregado en la Actividad 1 |
| `./iudigital_doc/EV2/rubricaEV2.txt` | Rúbrica de la Actividad 2 |
| `./iudigital_doc/EV2/CreditSmart_Arquitectura_EV2_generado.docx` | Documento técnico de la Actividad 2 (49 páginas). Lo produce su [generador](./iudigital_doc/EV2/generador/README.md) |
| `./iudigital_doc/EV2/guion-sustentacion-EV2.md` | Guion del encuentro sincrónico: demo, archivos que se muestran y preguntas probables con respuesta |
| `./iudigital_doc/EV1/generador/` | Scripts que generan ese documento y sus 8 gráficos. Escriben siempre en `..._generado.docx`, nunca sobre la copia editada. Ver su [`README.md`](./iudigital_doc/EV1/generador/README.md) |

---

## 7. Historial de cambios

Cambios sobre la reconstrucción inicial, con el porqué y lo que costaron.

### El simulador pasa a simular

**Motivo**: la ruta `/simulador` se llamaba «Simulador de Crédito» pero no
calculaba nada. Era un filtro del catálogo con un título que prometía otra cosa:
el estado del controlador era `{ query, rangeIndex, focusField }`, sin monto, sin
plazo y sin producto elegido, y la única matemática financiera del proyecto
—`CreditApplicationPolicy.assessAffordability`— solo se ejecutaba al **radicar una
solicitud**, nunca al simular.

**Qué hace ahora**: producto, monto y plazo → cuota mensual, total de intereses,
total a pagar y tabla de amortización por el sistema francés, con resumen anual o
detalle mes a mes. El filtro del catálogo se conserva tal cual, debajo y separado:
son dos herramientas distintas sobre la misma página.

| Capa | Archivo | Cambio |
|---|---|---|
| Dominio | `valueobjects/Installment.js` | **nuevo** — una fila de la amortización; invariante `cuota = interés + capital` |
| Dominio | `valueobjects/AmortizationPlan.js` | **nuevo** — el plan completo; 4 invariantes + `yearlySummary()` |
| Dominio | `services/CreditSimulationService.js` | **nuevo** — sistema francés; único sitio con la fórmula |
| Dominio | `services/CreditApplicationPolicy.js` | delega fórmula y errores de campo en el servicio nuevo |
| Aplicación | `dto/SimulationDTO.js` | **nuevo** — congelado en profundidad |
| Aplicación | `mappers/SimulationMapper.js` | **nuevo** — plan → DTO vía `IMoneyFormatter` |
| Aplicación | `usecases/SimulateCreditUseCase.js` | **nuevo** — orquesta; devuelve `Result` |
| Aplicación | `dto/CreditProductDTO.js` + mapper | `minAmount` y `maxAmount` crudos, para acotar los inputs |
| Presentación | `views/SimulatorView.js` | formulario, panel de resultado y tabla plegable |
| Presentación | `controllers/SimulatorController.js` | estado del simulador y del filtro, por separado |
| Config | `dependencies.js` | 2 registros: `simulationMapper` · `simulateCreditUseCase` (32 → 34) |
| Estilos | `06-pages.css` · `07-responsive.css` | ~215 líneas: resultado con tema, tabla con encabezado pegajoso |
| Pruebas | las tres suites | 146 → 240 aserciones |

**Cero contratos nuevos.** `ICreditProductRepository` ya tenía `findById` y
`IMoneyFormatter` ya formateaba: no hizo falta abrir un puerto, así que la regla
de dependencia no se tocó.

**Decisiones que costaron discusión**:

1. **El redondeo.** `Money` guarda enteros, así que cada cuota se redondea al
   peso y a 240 meses eso descuadra. La última cuota absorbe el residuo —es lo
   que hace la banca— y `AmortizationPlan` lo verifica: la suma de capital debe
   ser exactamente el capital prestado y el saldo final, cero.
2. **La fórmula, en un solo sitio.** Ya existía en `CreditApplicationPolicy`.
   Copiarla al simulador habría permitido que las dos cifras se separaran con
   cualquier ajuste posterior; ahora la política la consume del servicio.
3. **Un error de campo no borra la cifra anterior.** El controlador conserva la
   última simulación válida mientras el usuario corrige, en vez de dejar el panel
   en blanco a cada tecla intermedia.
4. **El filtro sigue siendo un filtro.** Se descartó que hacer clic en una tarjeta
   precargara ese producto en el simulador: acopla dos herramientas que funcionan
   mejor separadas.

### Sexto producto del catálogo — `Crédito de Libranza`

**Motivo**: la rúbrica de la actividad concede los puntos de «Contenido de las
páginas» con un mínimo de **6 productos** y la reconstrucción replicaba los 5 del
sitio original.

**Producto**: `id: 6` · $1 000 000 – $80 000 000 · 13,5 % E.A. · 96 meses · 🧾 ·
paleta `teal`. Descuento directo de nómina o pensión; es la segunda tasa más baja
del portafolio, entre el educativo (10,5 %) y el vehículo (14,2 %).

| Archivo | Cambio |
|---|---|
| `infrastructure/persistence/datasources/StaticCreditProductDataSource.js` | Una entrada nueva |
| `domain/valueobjects/ProductTheme.js` | `'teal'` en `THEME_PALETTES` — las cinco paletas del original ya estaban en uso |
| `assets/css/02-tokens.css` | `--color-teal-100/500/600/700` y el bloque `.theme-teal` |
| `tests/01`, `tests/02`, `tests/03` | Conteos esperados: 6 productos, 4 resultados en el filtro «Hasta $5.000.000», 7 opciones en el `<select>` |

**Lo que NO cambió**: ninguna vista, controlador, caso de uso ni componente. El
catálogo, el simulador y el `<select>` del formulario mostraron el producto nuevo
porque los tres derivan del mismo datasource. Es la [Receta
1](./18-guia-de-extension.md) ejecutada de verdad, y la mejor evidencia empírica
de la regla de dependencia.

**Detalle que conviene recordar**: el primer intento declaró `palette: 'teal'` sin
añadirla a `THEME_PALETTES`; `ProductTheme` rechazó el producto al construir el
catálogo, con la lista de paletas válidas en el mensaje. El fallo temprano
funcionó como está diseñado.

### Documento de arquitectura para la actividad

Se añadió `iudigital_doc/`: el documento de arquitectura (44 páginas, 21 figuras,
32 tablas) y los scripts que lo generan, con el patrón de diseño del documento
guía de la institución. El generador escribe en `..._generado.docx` y nunca sobre
la copia que se edita a mano; el porqué de esa regla está en el
[README del generador](./iudigital_doc/EV1/generador/README.md).
