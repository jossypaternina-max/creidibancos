# CreditSmart — Aplicación web dinámica con React

Plataforma web para **consultar, simular y solicitar productos de crédito**.
Búsqueda en tiempo real, filtros dinámicos, cálculo automático de la cuota
mensual con tabla de amortización y formulario de solicitud completamente
controlado.

Es la **Actividad 2** de Ingeniería Web: la interfaz de la Actividad 1
(JavaScript vanilla, sin build) reescrita en **React + Vite + React Router**
sobre la misma arquitectura hexagonal. El dominio, la aplicación y la
infraestructura **no se tocaron**; lo que cambió fue el adaptador de interfaz.
El detalle de la migración está en
[`docs/21-migracion-a-react-ev2.md`](./docs/21-migracion-a-react-ev2.md).

| Dato | Valor |
|---|---|
| Integrantes | Jeremy Ivan Pedraza Hernández · Jossy Esteban Paternina Julio |
| Docente | Jorge Armando Julio |
| Curso | Ingeniería Web — PREICA2602B010133 |
| Institución | Institución Universitaria Digital de Antioquia — 2026-S2 |
| Entrega anterior | Actividad 1, congelada en el tag `ev1-entrega` |

---

## 1. Tecnologías utilizadas

| Tecnología | Versión | Para qué |
|---|---|---|
| [React](https://react.dev) | 19 | Componentes, estado con hooks, render declarativo |
| [React Router](https://reactrouter.com) | 7 | Enrutado SPA (`/`, `/simulador`, `/solicitar`, 404) |
| [Vite](https://vite.dev) | 8 | Servidor de desarrollo y empaquetado |
| JavaScript | ES2022 (módulos ES) | Dominio, aplicación e infraestructura, sin dependencias |
| CSS3 | — | 7 hojas en cascada explícita, Grid y Flexbox, mobile-first |
| Node.js | ≥ 18 (probado en 22.14) | Entorno de desarrollo |

El núcleo de negocio **no depende de React**: son módulos ES estándar que se
ejecutan igual en Node (así corre la suite de pruebas) que en el navegador.

---

## 2. Instalación y ejecución

```bash
git clone <url-del-repositorio>
cd crediSmart

npm install        # instala React, React Router y Vite
npm run dev        # servidor de desarrollo -> http://localhost:5173
```

Otros comandos:

```bash
npm run build      # empaqueta para producción en dist/
npm run preview    # sirve dist/ para revisar el empaquetado
```

### Despliegue en Apache / Laragon

```bash
npm run build
```

`dist/` ya incluye el `.htaccess` (viene de `public/.htaccess`), que reescribe
las rutas limpias hacia `index.html`: así recargar en `/simulador` o
`/solicitar` funciona en lugar de devolver 404. Requiere `mod_rewrite`, activo
por defecto en Laragon. Para Nginx el equivalente es:

```nginx
location / { try_files $uri $uri/ /index.html; }
```

---

## 3. Capturas de pantalla

### Catálogo (`/`)

Hero, seis productos con su tasa, plazo, rango de montos y requisitos.

![Catálogo de productos](./docs/capturas/01-catalogo.jpg)

### Simulador (`/simulador`) — cálculo de la cuota mensual

La cuota se recalcula al cambiar producto, monto o plazo, sin pulsar ningún
botón. Todos los importes en formato COP.

![Simulador con la cuota mensual calculada](./docs/capturas/02-simulador.jpg)

### Búsqueda en tiempo real, filtros y ordenamiento

Búsqueda mientras se escribe, filtro por rango de monto, cinco criterios de
orden y botón para limpiar los filtros.

![Búsqueda y filtros del catálogo](./docs/capturas/03-busqueda-filtros.jpg)

### Solicitud (`/solicitar`) — validación en tiempo real

Formulario 100 % controlado. Los mensajes de error los produce el dominio, y el
error de un campo solo aparece cuando el usuario ya pasó por él.

![Formulario con validaciones en tiempo real](./docs/capturas/04-formulario-validaciones.jpg)

---

## 4. Funcionalidades

| Funcionalidad | Dónde está |
|---|---|
| Catálogo de 6 productos con `.map()` y `key` única | `pages/CatalogPage.jsx` + `components/CreditCard.jsx` |
| Búsqueda por nombre **mientras se escribe** | `components/SearchBar.jsx` + `hooks/useCreditSearch.js` |
| Filtro por rango de monto (5 rangos) | `components/AmountRangeFilter.jsx` |
| Ordenamiento con `.sort()` (5 criterios) | `components/SortSelect.jsx` + `hooks/useProductSorting.js` |
| Limpiar filtros | `hooks/useCreditSearch.js` |
| Cálculo automático de la cuota mensual | `hooks/useSimulation.js` + `domain/services/CreditSimulationService.js` |
| Total en intereses, total a pagar y coste del crédito | `components/SimulationResult.jsx` |
| Tabla de amortización (resumen anual y mes a mes) | `components/AmortizationTable.jsx` |
| Formulario controlado de 11 campos | `pages/ApplicationPage.jsx` + `components/FormField.jsx` |
| Validación en vivo de correo, cédula, montos e ingresos | `hooks/useApplicationForm.js` + `application/usecases/ValidateCreditApplicationDraftUseCase.js` |
| Radicado y persistencia de la solicitud | `infrastructure/persistence/LocalStorageCreditApplicationRepository.js` |
| Avisos accesibles (toasts) | `infrastructure/notification/ToastNotifier.js` |
| Diseño responsive mobile-first | `assets/css/07-responsive.css` |

---

## 5. Estructura de carpetas

```
crediSmart/
├── index.html                  Punto de entrada de Vite
├── package.json                Dependencias y scripts
├── vite.config.js              Configuración del empaquetador
├── public/.htaccess            Reescritura SPA para Apache (se copia a dist/)
├── assets/css/                 7 hojas en cascada, reutilizadas de la Actividad 1
├── src/
│   ├── main.jsx                Composition Root: construye el grafo y monta React
│   ├── App.jsx                 Tabla de rutas (React Router)
│   ├── data/
│   │   └── creditsData.js      Catálogo, rangos de monto y plazos (dato puro)
│   ├── components/             11 componentes reutilizables, props desestructuradas
│   ├── pages/                  4 páginas, una por ruta
│   ├── hooks/                  7 hooks: estado de UI + invocación de casos de uso
│   ├── context/
│   │   └── DependenciesProvider.jsx   Inyecta los casos de uso en el árbol React
│   ├── domain/                 Entidades, value objects, servicios, puertos, errores
│   ├── application/            Casos de uso, DTOs, mappers, Result
│   ├── infrastructure/         Adaptadores: persistencia, formato, reloj, ids, avisos
│   └── config/                 AppConfig, Container, dependencies, routes
├── tests/
│   └── 01-domain-application.mjs      Suite de dominio y aplicación (85 aserciones)
└── docs/                       21 documentos + capturas
```

Las tres carpetas que pide la rúbrica —`components/`, `pages/`, `data/`— están
en la raíz de `src/`. Las cuatro capas de la arquitectura conviven con ellas:
`components/`, `pages/`, `hooks/` y `context/` **son** la capa de presentación.

---

## 6. Arquitectura

### 6.1 Hexagonal: la interfaz es un adaptador

```
                 ┌──────────────────────────────┐
   React  ─────► │  application (casos de uso)  │ ─────► adaptadores
  (pages,        │        domain (núcleo)       │        (localStorage,
   hooks)        └──────────────────────────────┘         Intl, crypto…)
```

El dominio define **puertos** (interfaces) y la infraestructura los implementa.
El dominio no sabe que existe localStorage; localStorage no sabe que existe una
regla de crédito.

### 6.2 Regla de dependencia

```
presentación (React) ──► application ──► domain ◄── infrastructure
```

Las flechas apuntan siempre hacia el núcleo. Tres reglas verificables:

```bash
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)"              src/application/
grep -rn "infrastructure" src/components src/pages src/hooks src/context src/App.jsx
```

Las tres devuelven **cero resultados**.

### 6.3 Reparto de responsabilidades en React

| Pieza | Puede | No puede |
|---|---|---|
| `components/` | Recibir props y devolver JSX | Tener estado, efectos ni llamar a casos de uso |
| `pages/` | Componer, decidir qué se muestra y en qué orden | Consultar datos por su cuenta |
| `hooks/` | Guardar estado de UI, invocar casos de uso, desenvolver `Result` | Contener reglas de negocio |
| casos de uso | Orquestar y devolver `Result` con DTOs | Tener reglas propias o tocar el DOM |
| dominio | Todas las reglas e invariantes | Conocer React, el DOM, la red o el almacenamiento |

Fuera de un hook no circula ni un `Result` ni una entidad: solo datos planos.

### 6.4 Contratos verificables

JavaScript no tiene `interface`, así que se declaran explícitamente:

```js
export const ICreditProductRepository = defineContract('ICreditProductRepository',
  ['findAll', 'findById', 'findByCriteria', 'count']);
```

`assertImplements(instancia, Contrato)` comprueba en el contenedor que el
adaptador implementa de verdad todos los métodos, y `eagerResolveAll()`
construye el grafo al arrancar: un contrato roto falla al cargar la página, no
a mitad de una interacción.

### 6.5 Inyección de dependencias

`config/dependencies.js` es el **único** archivo con `new` de clases concretas.
`DependenciesProvider` traduce el contenedor a un objeto **congelado** de casos
de uso, así que un componente no puede pedir un repositorio: no está ahí.

```js
const { simulateCredit } = useDependencies();   // un caso de uso, no un adaptador
```

---

## 7. Hooks de React usados

| Hook | Dónde y para qué |
|---|---|
| `useState` | Texto de búsqueda, rango, orden, visibilidad, producto/monto/plazo del simulador, los 11 campos del formulario, campos tocados, envío en curso, radicado |
| `useEffect` | Cargar catálogo, rangos y nombres de producto; relanzar la búsqueda; recalcular la cuota; validar el borrador; fijar el título del documento |
| `useMemo` | Ordenar y filtrar el catálogo sin recalcular en cada render; construir el objeto de dependencias una sola vez |
| `useCallback` | Acciones estables (`setValue`, `submit`, `reset`, `clearFilters`) para no re-renderizar los componentes hijos |
| `useContext` | Acceso a las dependencias inyectadas (`useDependencies`) |
| Hooks propios | `useCreditProducts`, `useCreditSearch`, `useProductSorting`, `useSimulation`, `useApplicationForm`, `useDocumentTitle`, `useDependencies` |

Todo `useEffect` asíncrono marca `cancelled` en su función de limpieza, porque
React monta dos veces en modo estricto.

---

## 8. Verificación

```bash
node tests/01-domain-application.mjs   # 85 aserciones -> TODO OK
npm run build                          # compila sin errores
```

Comprobado además en navegador: navegación entre las cuatro rutas sin recarga,
recarga directa en rutas profundas, búsqueda incremental, recálculo de la cuota,
validación en vivo, radicado con aviso y limpieza del formulario, y 404 en una
ruta inexistente. Sin errores ni advertencias en consola.

---

## 9. Documentación

**Índice maestro: [`docs/master.md`](./docs/master.md)** — 21 documentos sobre el
patrón de diseño, las entidades, los value objects, los contratos, los casos de
uso, los adaptadores, la inyección de dependencias, el enrutado, los estilos,
los flujos end-to-end, las recetas de extensión y las convenciones.

Lecturas recomendadas para esta entrega:

| Documento | Qué responde |
|---|---|
| [21 — Migración a React](./docs/21-migracion-a-react-ev2.md) | Qué cambió y qué no al pasar de vanilla a React, y por qué |
| [02 — Arquitectura hexagonal](./docs/02-arquitectura-hexagonal.md) | Qué es un puerto y qué es un adaptador |
| [03 — Clean Architecture y capas](./docs/03-clean-architecture-capas.md) | Quién puede importar a quién |
| [10 — Casos de uso y DTOs](./docs/10-casos-de-uso-y-dtos.md) | Por qué la interfaz recibe DTOs y nunca entidades |
| [18 — Guía de extensión](./docs/18-guia-de-extension.md) | Recetas paso a paso para añadir producto, campo o página |

La documentación académica está en [`docs/iudigital_doc/`](./docs/iudigital_doc/):
`EV1/` con el documento de arquitectura de la Actividad 1 y su generador, y
`EV2/` con la rúbrica de esta entrega.
