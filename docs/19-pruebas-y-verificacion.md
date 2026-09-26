[← Volver al índice maestro](./master.md)

# 19 — Pruebas y verificación

> Dos suites automáticas, cuatro comprobaciones estructurales con `grep` y una
> pasada por el navegador. Ninguno de los tres niveles sobra: cada uno atrapa
> fallos que los otros dos no ven.

## 19.1 Las dos suites

```
tests/
├── 01-domain-application.mjs   Núcleo, sin DOM, sin dependencias
└── 02-boot-jsdom.mjs           La interfaz real montada en un DOM simulado
```

| Suite | Qué cubre | Dependencias | Aserciones |
|---|---|---|---|
| 01 | Value objects, entidades, servicios de dominio, simulación, criterios, los 7 casos de uso, repositorios | **ninguna** | 85 |
| 02 | Grafo de dependencias completo, las 7 rutas montadas y pintadas, armazón común, ausencia de errores | jsdom + Vite (solo pruebas) | 19 |

Ejecución:

```bash
cd C:/laragon/www/crediSmart

node tests/01-domain-application.mjs

npm install jsdom --no-save        # una sola vez
node tests/02-boot-jsdom.mjs
```

Las dos imprimen `TODO OK` y devuelven código de salida 0. Cualquier fallo
imprime `FAIL: <descripción>` y sale con 1, así que sirven en un pipeline de CI
sin adaptación.

**No hay framework de pruebas.** No hay Jest, ni Vitest, ni Mocha. Son dos
scripts con un `check(condición, mensaje)` de tres líneas. La aplicación no
tiene más dependencias de runtime que React y React Router; jsdom es solo para
la segunda suite.

### Histórico

En la Actividad 1 había tres suites: dominio/aplicación, render de las vistas
como cadenas y arranque en jsdom. Las dos últimas probaban plantillas de cadena
y un router propio que ya no existen. La suite 02 actual las sustituye montando
la aplicación React de verdad, que es lo que hay que proteger ahora.


## 19.2 Suite 01 — Dominio y aplicación

`tests/01-domain-application.mjs`

### Por qué esta suite es la prueba de la arquitectura

Se ejecuta en Node **sin navegador, sin DOM, sin jsdom y sin dependencias**. Si el
dominio importara `document`, `window`, `fetch`, `localStorage` o `Intl`
directamente, este archivo no arrancaría.

Que arranque **es** la verificación de que el núcleo está aislado. No es una
prueba *sobre* la arquitectura: es una consecuencia de ella.

El grafo se construye a mano, con dobles que son objetos literales:

```js
const logger = new ConsoleLogger({ level: 'silent' });
const applicationRepository = new LocalStorageCreditApplicationRepository({
  idGenerator,
  storage: null,          // ← sin localStorage
});
```

Eso solo es posible porque los contratos son pequeños (ISP) y todo entra por
constructor (DIP). Sin librería de mocking.

### Qué verifica

**Value objects** (13 aserciones)

| Comprobación | Código esperado |
|---|---|
| `Money`: igualdad por valor y comparación | — |
| `Money` rechaza negativos | `NEGATIVE_MONEY_AMOUNT` |
| `Money` rechaza `NaN` | `INVALID_MONEY_AMOUNT` |
| `Money` rechaza mezclar COP con USD | `CURRENCY_MISMATCH` |
| `InterestRate.monthlyFraction` usa `(1+i)^(1/12)−1`, no `i/12` | — |
| `InterestRate` rechaza tasas > 100 | `RATE_OUT_OF_BOUNDS` |
| `Term` rechaza plazos negativos | `INVALID_TERM` |
| `AmountRange` rechaza rangos invertidos | `INVERTED_RANGE` |
| `AmountRange.overlaps` con y sin intersección, y con máximo infinito | — |
| `CreditProduct.normalize` quita acentos y mayúsculas | — |

**Catálogo** (6 aserciones): 6 productos, formato `$ 1.000.000 – $ 30.000.000`,
`themeClass: 'theme-blue'`, DTO congelado, y —importante— que el DTO **no tenga
métodos**:

```js
ok(typeof list.value.products[0].admitsAmount === 'undefined',
   'DTO sin comportamiento (la vista no puede ejecutar reglas)');
```

**Búsqueda y filtros** (9 aserciones): `"vehiculo"` → 1, `"credito"` → 5, sin
resultados → 0, los 5 rangos, `"Hasta $5.000.000"` → 3,
`"Más de $100.000.000"` → 3, `isFiltered` false sin filtros, nombres derivados del
catálogo.

**Radicación** (13 aserciones): formulario vacío → 11 errores con las claves
exactas; solicitud válida → radicado con formato `CS-XXXXXXXX`, estado `RADICADA`,
primer nombre extraído, capacidad de pago calculada, persistencia; monto fuera de
rango → rechazado por `CreditApplicationPolicy` con el mensaje literal; email
inválido y destino corto → rechazados.

**Simulación de crédito** (22 aserciones). Las cifras de referencia se calcularon
aparte y se comprueban literalmente:

| Caso | Comprobación |
|---|---|
| Libre Inversión · $10.000.000 · 36 m · 18,5 % E.A. | cuota exacta de **$357.000** |
| — | la suma de los abonos a capital es exactamente $10.000.000 |
| — | la última cuota ($356.984) difiere: absorbe el residuo del redondeo |
| — | `totalPaid = capital + totalInterest` |
| — | el interés del mes 1 se calcula sobre el saldo inicial y decrece después |
| Vivienda · $300.000.000 · **240 m** · 11,8 % E.A. | el capital sigue cuadrando al peso y el saldo cierra en cero |
| — | `yearlySummary()` produce 20 bloques que conservan el capital total |
| Tasa 0 % | degenera en el reparto lineal `P / n` |
| Fórmula compartida | `CreditApplicationPolicy` y el simulador dan la misma cuota |

El caso de 240 meses no es decorativo: es donde la deriva del redondeo se acumula
y donde un reparto mal hecho dejaría un saldo final distinto de cero.

Invariantes que deben **rechazarse**: plazo mayor que el máximo del producto
(`VALIDATION_ERROR` con `termInMonths`), monto fuera de rango (con `amount`), una
`Installment` cuya cuota no sea interés + capital (`INSTALLMENT_NOT_BALANCED`) y
un `AmortizationPlan` con menos cuotas que meses (`PLAN_LENGTH_MISMATCH`).

**`SimulateCreditUseCase`** (22 aserciones): simula con la entrada en texto tal
como llega del formulario; el DTO trae los importes como números planos, sin
métodos y congelado en profundidad; y el caso de uso **nunca lanza** — producto
inexistente, monto vacío, plazo cero, monto y plazo inválidos a la vez (que se
reportan juntos), monto fuera de rango y llamada sin argumentos devuelven todos
un `Result` de fallo con sus `fieldErrors`.

### Salida real

```
--- Value objects ---
ok  : Money: igualdad por valor
ok  : Money: rechaza negativos (NEGATIVE_MONEY_AMOUNT)
ok  : Money: rechaza mezcla de monedas (CURRENCY_MISMATCH)
ok  : InterestRate: tasa mensual equivalente, no anual/12
ok  : AmountRange: overlaps con máximo sin límite
ok  : CreditProduct.normalize: sin acentos ni mayúsculas

--- Catálogo ---
ok  : catálogo con 6 productos (6)
ok  : formato monetario es-CO/COP ($ 1.000.000 – $ 30.000.000)
ok  : DTO congelado
ok  : DTO sin comportamiento (la vista no puede ejecutar reglas)

--- Búsqueda y filtros ---
ok  : búsqueda "vehiculo" → 1 (1)
ok  : rango "Hasta $5.000.000" → 3 (3)
ok  : rango "Más de $100.000.000" → 3 (3)
ok  : sin filtros → isFiltered false

--- Radicación de solicitudes ---
ok  : 11 errores de campo (11)
      campos: fullName, idNumber, email, phone, productName, amount,
              termInMonths, purpose, companyName, jobTitle, monthlyIncome
ok  : número de radicado con formato (CS-F49B53E9)
ok  : capacidad de pago: cuota 1146680 ≤ tope 1400000
ok  : monto fuera de rango rechazado por CreditApplicationPolicy
      mensaje: El monto debe estar entre $5.000.000 y $120.000.000 para Crédito Vehículo.

TODO OK
```

### Un detalle que costó una iteración

`Intl.NumberFormat('es-CO')` separa el símbolo de moneda con un **espacio duro**
(U+00A0), no con un espacio normal. La primera versión de la aserción comparaba
contra un espacio ASCII y fallaba con una salida que *parecía* idéntica. La
corrección normaliza los espacios al comparar:

```js
// Intl separa el símbolo con un espacio duro (U+00A0); se normaliza al comparar.
const normalizeSpaces = (value) => value.replace(/\s/g, ' ');
ok(normalizeSpaces(list.value.products[0].amountRangeLabel) === '$ 1.000.000 – $ 30.000.000', …);
```

## 19.3 Suite 02 — Arranque de la interfaz

`tests/02-boot-jsdom.mjs`

Monta la aplicación real —el mismo `App.jsx`, el mismo contenedor de
dependencias— dentro de un DOM simulado y recorre las siete rutas (incluida
`/mis-solicitudes`). El grafo construye el cliente de Firebase y los
repositorios de Firestore al arrancar; como el render de la prueba no ejecuta
efectos, no se hace ninguna llamada de red. Ver
[24 §12](./24-integracion-firebase-ev3.md).

### Qué verifica

1. **Que el grafo de dependencias se resuelve entero.** `eagerResolveAll()`
   construye todas las dependencias al arrancar, así que un contrato roto falla
   aquí y no a mitad de una navegación.
2. **Que cada ruta pinta su contenido sin lanzar.** `/`, `/productos`,
   `/simulador`, `/solicitar`, `/ayuda` y una ruta inexistente.
3. **Que el armazón común está en todas.** Enlace de salto al contenido, barra
   de navegación, pie y conmutador de tema.
4. **Que no queda ningún emoji de interfaz en el marcado**, que es una de las
   reglas de la identidad visual.
5. **Que ninguna ruta deja errores en consola.**

### Cómo está montada

El DOM simulado se crea **antes** de cargar nada de la aplicación, porque el
adaptador de avisos busca `#notifications` y el repositorio de solicitudes usa
`localStorage` en cuanto se construyen:

```js
const dom = new JSDOM('…<div id="root"></div><div id="notifications"></div>…');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;

// jsdom no implementa matchMedia y el conmutador de tema lo consulta.
dom.window.matchMedia = () => ({
  matches: false, addEventListener() {}, removeEventListener() {},
});
```

Vite se usa **solo** para traducir JSX y resolver los imports de CSS
(`vite.ssrLoadModule`); React se importa directo. La aplicación se ejecuta tal
cual, sin adaptaciones para la prueba.

### Dos detalles que costaron una iteración

**`globalThis.navigator` no se puede asignar** en Node 22: solo tiene getter.
Como jsdom ya expone el suyo a través de `window`, basta con no tocarlo.

**El paquete construido no sirve para esta prueba.** El primer intento cargaba
`dist/` con `window.eval()` y fallaba con `Cannot use 'import.meta' outside a
module`: el bundle de Vite usa `import.meta`, que no existe fuera de un módulo
ES. De ahí el cambio a `ssrLoadModule` sobre el código fuente.


## 19.4 Verificación estructural con `grep`

Complementa las suites: comprueba la **arquitectura**, no el comportamiento.

```bash
cd C:/laragon/www/crediSmart

# 1. El dominio no importa nada de fuera del dominio
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/

# 2. La aplicación no importa infraestructura, presentación ni config
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)" src/application/

# 3. La presentación no importa infraestructura
grep -rn "infrastructure" src/components/ src/pages/ src/hooks/ src/context/ src/App.jsx

# 4. Ningún color fuera del archivo de tokens
grep -rn "#[0-9a-fA-F]\{3,8\}" assets/css/ --include=*.css | grep -v 02-tokens.css
```

Las cuatro deben devolver **cero líneas**. Estado actual: cero, cero, cero, cero.

Durante la construcción, la comprobación 3 detectó el único incumplimiento real:
un controlador importaba las opciones de plazo directamente del datasource. Se
corrigió inyectando `termOptions` desde `dependencies.js`.

La comprobación 4 es la que mantiene honesto el sistema de estilos: es fácil
escribir un `#fff` «solo por esta vez», y es justo así como una paleta de tres
colores acaba teniendo nueve.

## 19.5 Verificación en el navegador

Lo que las suites no cubren: apariencia y comportamiento real del navegador.
**No es opcional.** La última pasada destapó tres fallos que las capturas
automatizadas daban por buenos, incluido un formulario que se autoenviaba al
llegar al último paso ([23 §12](./23-rediseno-ui-ux.md)).

### Rutas y recarga

| Prueba | Esperado |
|---|---|
| Abrir `/` | Hero, seis accesos de producto y banda institucional |
| Clic en «Productos» | Cambia sin recarga (sin parpadeo) |
| **Recargar** en `/simulador` | Carga el simulador, no un 404 de Apache |
| **Recargar** en `/productos` | Carga el catálogo |
| Abrir `/loquesea` | Pantalla 404 con la ruta pedida |
| Botón atrás/adelante | Navega correctamente |
| Ctrl+clic en un enlace | Abre en pestaña nueva (no lo intercepta el router) |

Si recargar da 404: falta la reescritura del servidor
([14 §14.5](./14-enrutado-y-urls.md)).

### Flujos completos, pulsando

| Flujo | Qué comprobar |
|---|---|
| Simulador | Cambiar producto, monto y plazo recalcula la cuota sin pulsar nada; los atajos de porcentaje mueven el deslizador y el campo a la vez |
| Amortización | Se despliega, alterna resumen anual y detalle mensual, y la tabla scrollea sin mover la página |
| Puente | «Solicitar este crédito» lleva a `/solicitar?product=&amount=&term=` con el resumen prellenado |
| Formulario | Los tres pasos avanzan **sin** revelar errores del paso siguiente; enviar produce radicado y aviso |
| Filtros | Búsqueda incremental, tipo, monto, plazo, orden y «Limpiar filtros» |

El cuarto es el que más vigilancia merece: un formulario por pasos **no se
valida con capturas**, hay que pulsarlo.

### Medir, no mirar

Conviene comprobar posiciones en el DOM en vez de fiarse de una captura:

```js
const r = (s) => document.querySelector(s).getBoundingClientRect();

r('.hero__visual').right === document.documentElement.clientWidth;   // llega al borde
r('#confianza-home').x === r('.home-products .container').x;         // sigue la retícula
document.documentElement.scrollWidth === document.documentElement.clientWidth;
```

Las dos primeras fallaban a 1912 px y pasaban a 1440. Una captura a un solo
ancho no lo habría enseñado nunca.

### Responsive

| Ancho | Esperado |
|---|---|
| 375 / 414 | Sin desbordamiento horizontal; menú plegado; 1 tarjeta por fila |
| 768 / 820 | 2 tarjetas por fila; filtros sobre la rejilla |
| 1024 | 3 tarjetas; filtros como barra lateral |
| 1440 / 1920 | Más aire; la fotografía del hero llega al borde de la ventana |

### Temas

Claro forzado, oscuro forzado y automático. Con el sistema en oscuro y sin
elección previa, el sitio debe abrir **en oscuro**: es el comportamiento
correcto, no un fallo de estilos.

### Accesibilidad

- Tabular por toda la página: cada control muestra el anillo de foco.
- El enlace «Saltar al contenido» aparece al primer tabulador.
- Con lector de pantalla: errores (`role="alert"`) y avisos se anuncian; los
  deslizadores anuncian el importe, no el índice.
- Activar «reducir movimiento»: transiciones y animaciones se detienen.

### Consola

Cero errores. Un `ContractViolationError` o un `Dependencia no registrada`
aparece al cargar, no durante la navegación — por diseño.



Complementa las suites: comprueba la **arquitectura**, no el comportamiento.

```bash
cd C:/laragon/www/crediSmart

# 1. El dominio no importa nada de fuera del dominio
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/

# 2. La aplicación no importa infraestructura, presentación ni config
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)" src/application/

# 3. La presentación no importa infraestructura
grep -rn "infrastructure" src/presentation/

# 4. El contenedor solo se usa en el arranque
grep -rln "Container" src/ --include=*.js
# → src/config/Container.js · src/config/dependencies.js · src/main.js

# 5. Solo ViewRenderer (y el fallback de main.js) escriben innerHTML
grep -rn "innerHTML" src/ --include=*.js
```

Las tres primeras deben devolver **cero líneas**. Estado actual: cero, cero, cero.

Durante la construcción, la comprobación 3 detectó el único incumplimiento real:
`ApplicationController` importaba `STATIC_TERM_OPTIONS` del datasource. Se corrigió
inyectando `termOptions` desde `dependencies.js`.

## 19.6 Qué NO está cubierto

Honestidad sobre los límites:

| No cubierto | Por qué / mitigación |
|---|---|
| Pruebas visuales de regresión automáticas | Se hacen a mano contra el mockup aprobado; automatizarlas exigiría capturas de referencia versionadas |
| Navegadores reales (Safari, Firefox) | jsdom no es un navegador; verificación manual |
| Rendimiento con catálogos grandes | Con 6 productos el re-render completo es instantáneo; con 500 haría falta render incremental |
| Rehidratar solicitudes desde `localStorage` | El repositorio persiste `toJSON()`, pero no reconstruye entidades: nadie consume el histórico todavía |
| Restauración exacta del scroll con el botón atrás | `ScrollToTop` sube al inicio en cada cambio de ruta; guardar el scroll por entrada de historial queda pendiente |
| Tipos de los parámetros de los contratos | `assertImplements` verifica existencia de métodos, no firmas; ver [06 §6.9](./06-contratos-e-interfaces.md) |

## 19.7 Añadir pruebas

Ubicación por capa:

| Qué pruebas | Dónde |
|---|---|
| Un value object, una entidad, un servicio de dominio, un caso de uso | suite 01 |
| Una ruta nueva, un componente del armazón, un contrato | suite 02 |
| Una interacción completa del usuario | navegador (§19.5) |

El helper es siempre el mismo:

```js
let fails = 0;
const ok = (cond, msg) => {
  if (!cond) { fails += 1; console.log('FAIL:', msg); } else console.log('ok  :', msg);
};
// …al final
console.log(fails === 0 ? '\nTODO OK' : `\n${fails} FALLOS`);
process.exit(fails === 0 ? 0 : 1);
```

Convenciones:

- **Un mensaje descriptivo por aserción**, y cuando el valor importa, incluirlo:
  `` `6 tarjetas (${count})` ``. Un `FAIL` debe decir qué se obtuvo, no solo que
  falló.
- **Afirmar sobre estructura, no sobre formato**: cuenta `data-product-id="`, no
  espacios ni sangrías.
- **Incluir aserciones negativas** cuando lo importante es una ausencia
  (`!simulatorHtml.includes('Requisitos:')`).
- **Normalizar espacios** al comparar salidas de `Intl`.

## 19.8 Nota sobre `node_modules`

`npm install jsdom --no-save` añade jsdom al `node_modules/` que ya crea
`npm install`. Es **solo** para la suite 02: el paquete de producción no lo
incluye. El `.gitignore` excluye `node_modules/`.

## 19.9 Siguiente lectura

- [23 — Rediseño UI/UX](./23-rediseno-ui-ux.md): los tres fallos que solo
  aparecieron al pulsar la aplicación en el navegador, con su causa.
- [20 — Glosario y convenciones](./20-glosario-y-convenciones.md)
- [18 — Guía de extensión](./18-guia-de-extension.md)
