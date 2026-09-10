# 21 — Migración a React (Actividad 2)

> Qué cambió, qué no cambió y por qué, al sustituir la interfaz de la
> Actividad 1 (JavaScript vanilla) por React con React Router.
>
> Documentos afectados: [04](./04-mvc-presentacion.md) ·
> [12](./12-vistas-controladores-componentes.md) ·
> [13](./13-inyeccion-de-dependencias.md) ·
> [14](./14-enrutado-y-urls.md) · [19](./19-pruebas-y-verificacion.md).
> Los demás siguen vigentes palabra por palabra.

---

## 1. La tesis de la migración

La Actividad 1 exigía JavaScript sin frameworks; la Actividad 2 exige React. Si
la interfaz y las reglas de negocio hubieran estado mezcladas, cambiar de
tecnología habría significado reescribir la aplicación entera.

No fue el caso. El resultado medido:

| Capa | Archivos antes | Archivos después | Cambio |
|---|---|---|---|
| `domain/` | 26 | 26 | **ninguno** |
| `application/` | 15 | 16 | 1 caso de uso nuevo · 1 modificado |
| `infrastructure/` | 11 | 10 | −1 (`HistoryRouter`, lo hace React Router) |
| `config/` | 4 | 4 | `dependencies.js` deja de registrar presentación |
| `data/` | — | 1 | catálogo extraído a `creditsData.js` |
| presentación | 22 (`presentation/`) | 25 (`components/` 11 · `hooks/` 7 · `pages/` 4 · `context/` 1 · `App.jsx` · `main.jsx`) | **reescrita** |

Es exactamente lo que promete la arquitectura hexagonal: la interfaz es un
**adaptador**, y un adaptador se sustituye. La prueba objetiva es que
`tests/01-domain-application.mjs` —85 aserciones sobre dominio y aplicación—
sigue imprimiendo `TODO OK` sin haber tocado una línea del núcleo.

---

## 2. Equivalencias: de vanilla a React

Cada pieza de la Actividad 1 tiene su equivalente. No se perdió ningún concepto,
cambió su forma de expresarse.

| Actividad 1 (vanilla) | Actividad 2 (React) | Qué hace |
|---|---|---|
| `presentation/views/*View.js` | `src/pages/*Page.jsx` | Pintar una pantalla |
| `presentation/controllers/*Controller.js` | `src/hooks/use*.js` | Guardar el estado de UI e invocar casos de uso |
| `presentation/components/*Component.js` | `src/components/*.jsx` | Componentes reutilizables sin estado |
| `BaseView` + `this.on(...)` | React | Ciclo de vida y limpieza de listeners |
| `ViewRenderer` (`innerHTML`) | React DOM | Escribir en el DOM |
| `Html.js` (`html`, `raw`, `escapeHtml`) | JSX | Escapado por defecto |
| `HistoryRouter` + `UrlBuilder` | `BrowserRouter`, `Routes`, `NavLink`, `Link` | Navegación sin recarga |
| `DocumentTitleController` (decorador) | `useDocumentTitle` | Título por ruta |
| `container.resolve(...)` en `main.js` | `DependenciesProvider` + `useDependencies` | Entregar dependencias a la interfaz |
| `IView` · `IController` · `IRouter` | — | Contratos que React ya impone por firma |

Los tres contratos de presentación desaparecen porque su función era **forzar
una forma** que en React viene dada: un componente es una función que devuelve
JSX, y un hook devuelve estado. Los **nueve puertos de dominio y aplicación
siguen intactos**, porque esos no describen la interfaz, describen el negocio.

---

## 3. Cómo se inyectan las dependencias en React

Sigue habiendo un solo Composition Root y sigue siendo el único sitio con `new`.

```
main.jsx                         ← construye el grafo y lo monta
 └─ buildContainer()             ← config/dependencies.js: el único `new`
     └─ eagerResolveAll()        ← una violación de contrato falla al cargar
 └─ <DependenciesProvider>       ← traduce el contenedor a casos de uso
     └─ <BrowserRouter>
         └─ <App>                ← tabla de rutas
             └─ páginas → hooks → casos de uso
```

El detalle que preserva la regla de dependencia: **el proveedor no expone el
contenedor**, expone un objeto congelado con los casos de uso ya resueltos.

```js
// src/context/DependenciesProvider.jsx
const services = useMemo(
  () => Object.freeze({
    listCreditProducts: container.resolve('listCreditProductsUseCase'),
    searchCreditProducts: container.resolve('searchCreditProductsUseCase'),
    // …
  }),
  [container],
);
```

Un componente no puede pedir `productRepository` porque no está ahí. La regla
«la presentación nunca importa infraestructura» deja de depender de la
disciplina de quien escribe la vista: es imposible por construcción.

---

## 4. Los tres cambios reales que exigió React

Todo lo demás fue traducción mecánica. Estos tres son decisiones de diseño.

### 4.1 `SearchCreditProductsUseCase` acepta un índice, no un value object

Antes, el `SimulatorController` recibía inyectado `IAmountRangeProvider`,
resolvía el `AmountRange` y lo pasaba al caso de uso. Un componente React no
debe construir value objects del dominio, así que el caso de uso pasó a aceptar
`amountRangeIndex` y a resolver el rango él mismo contra el puerto:

```js
async execute({ query = '', amountRange = null, amountRangeIndex = null } = {}) {
  const range = amountRange ?? (await this.#resolveRange(amountRangeIndex));
  const criteria = new ProductSearchCriteria({ query, amountRange: range });
  // …
}
```

La interfaz manda primitivos y recibe DTOs. Nada más cruza la frontera.

### 4.2 `ValidateCreditApplicationDraftUseCase`: validación en vivo sin duplicar reglas

La rúbrica pide validación en tiempo real de correo, cédula y montos. La
tentación es escribir esas validaciones en el componente, y entonces hay **dos
verdades** sobre lo que es válido: la del formulario y la del dominio.

El caso de uso nuevo valida un borrador reutilizando `CreditApplicationMapper`,
es decir, los value objects `Applicant`, `RequestedCredit` y `EmploymentInfo`,
y devuelve `Result` con `fieldErrors` planos, **sin persistir nada**:

```js
async execute(rawForm = {}) {
  try {
    CreditApplicationMapper.toValueObjects(rawForm);
    return Result.ok({ isValid: true });
  } catch (err) {
    return Result.fromError(err);
  }
}
```

`useApplicationForm` lo llama en cada pulsación. El mensaje que ve el usuario
mientras escribe es literalmente el que produjo el dominio, y las reglas que
validan al escribir son las mismas que validan al enviar.

### 4.3 El catálogo pasa a `src/data/creditsData.js`

La rúbrica pide una carpeta `data/` con el archivo de datos. Los arrays crudos
se movieron allí y `StaticCreditProductDataSource` los reexporta con los nombres
`STATIC_*` que ya usaban los repositorios. No rompe la regla de dependencia
porque `creditsData.js` **no importa nada**: es dato puro, sin capa.

---

## 5. Dónde va el código nuevo (árbol actualizado)

```
¿Es una regla que seguiría siendo verdad sin navegador y sin pantalla?
 ├─ SÍ, un concepto ............................ domain/entities · valueobjects
 ├─ SÍ, cruza conceptos ........................ domain/services
 └─ SÍ, criterio de selección .................. domain/criteria

¿Es "el sistema debe poder hacer X"? ............ application/usecases

¿Habla de una tecnología (fetch, localStorage, Intl, crypto)?
 └─ SÍ ......................................... infrastructure/… (con puerto)

¿Pinta píxeles? ................................. src/components (sin estado)
                                                  src/pages (una ruta)
¿Guarda estado de UI o llama a un caso de uso? .. src/hooks
¿Es un `new` que une capas? ..................... config/dependencies.js, y SOLO ahí
¿Es un dato del catálogo? ....................... src/data/creditsData.js
```

Reglas propias de la capa React:

- Un componente por archivo, **props desestructuradas** en la firma.
- Los componentes de `components/` son puros: sin `useEffect`, sin llamadas a
  casos de uso. Reciben datos y devuelven JSX.
- Las páginas de `pages/` no consultan datos: piden un hook.
- Los hooks son los únicos que llaman a `execute()` y los únicos que ven un
  `Result`. Fuera del hook solo circulan datos planos.
- Nunca se importa una entidad ni un value object: se trabaja con DTOs.
- Todo `useEffect` con `async` marca `cancelled` en su limpieza, porque React
  monta dos veces en modo estricto.
- Los DTOs llegan congelados: para ordenar hay que copiar (`[...products].sort()`).

---

## 6. Verificación

Las tres reglas de dependencia se comprueban igual, cambiando la ruta de la
presentación:

```bash
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)"              src/application/
grep -rn "infrastructure" src/components src/pages src/hooks src/context src/App.jsx
```

Las tres deben devolver **cero resultados**. Estado actual: cero.

Además:

```bash
node tests/01-domain-application.mjs   # dominio y aplicación: TODO OK
npm run build                          # compila sin errores
```

Las suites `02-presentation-render.mjs` y `03-boot-jsdom.mjs` se retiraron:
probaban el render de plantillas de cadena y el arranque con jsdom, dos cosas
que ya no existen. La primera suite —la que cubre las reglas de negocio— es la
que importaba y sigue en pie.

---

## 7. Lo que esta migración demuestra

Tres afirmaciones que en la Actividad 1 eran teóricas y ahora tienen evidencia:

1. **El dominio no depende de la tecnología.** Se cambió la interfaz completa y
   no se tocó ni un archivo de `domain/`.
2. **La regla de dependencia es lo que hace baratos los cambios grandes.** El
   coste de la migración fue proporcional al tamaño de la presentación, no al
   del proyecto.
3. **Los contratos sirven para lo que se dijo.** `IRouter`, `IView` e
   `IController` se retiraron porque su necesidad desapareció; los nueve puertos
   de negocio se quedaron porque la necesidad sigue ahí. Un puerto vive en la
   capa que tiene la necesidad, no en la que la satisface.
