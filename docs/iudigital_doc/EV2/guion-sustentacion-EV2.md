[← Volver al índice maestro](../../master.md)

# Guion de sustentación — Actividad 2 (CreditSmart en React)

> Para el encuentro sincrónico. Duración prevista: **10–12 minutos** de
> exposición + preguntas.
>
> Integrantes: Jeremy Ivan Pedraza Hernández · Jossy Esteban Paternina Julio
> Curso: Ingeniería Web — PREICA2602B010133 · Docente: Jorge Armando Julio

---

## 0. Antes de conectarse (5 minutos de preparación)

```bash
cd C:\laragon\www\crediSmart
git checkout ev2-react
npm install          # solo si es una máquina nueva
npm run dev          # deja el servidor corriendo en http://localhost:5173
```

Ten abiertas, **en este orden**, estas pestañas. Es el mismo orden del recorrido
de archivos del §3: si las dejas así, la sustentación es pasar de pestaña en
pestaña sin buscar nada.

| # | Pestaña | Para qué |
|---|---|---|
| 1 | Navegador en `http://localhost:5173` | La demo (§2) |
| 2 | `vite.config.js` | Parada 1 — configuración |
| 3 | `src/main.jsx` | Parada 2 — arranque y `BrowserRouter` |
| 4 | `src/App.jsx` · `src/config/routes.js` | Parada 3 — React Router |
| 5 | `src/components/CreditCard.jsx` | Parada 4 — componentes y props |
| 6 | `src/hooks/useCreditSearch.js` | Parada 5 — `useState` y búsqueda |
| 7 | `src/pages/SimulatorPage.jsx` · `src/hooks/useProductSorting.js` | Parada 6 — arrays |
| 8 | `src/domain/services/CreditSimulationService.js` | Parada 7 — fórmula de la cuota |
| 9 | `src/hooks/useApplicationForm.js` | Parada 8 — formulario controlado |
| 10 | Terminal libre | Cierre en vivo (§4) |

Comprobación de un minuto antes de entrar: abre `/productos`, teclea en el
buscador y cambia el monto en `/simulador`. Si eso funciona, la demo funciona.

**Limpia el localStorage** antes de empezar (DevTools → Application → Local
Storage → borrar), para que la solicitud que radiques en vivo sea la primera.

---

## 1. Apertura — la frase que ordena toda la sustentación (30 s)

> «CreditSmart ya existía: en la Actividad 1 lo construimos en HTML, CSS y
> JavaScript sin frameworks, sobre una arquitectura hexagonal. Para la Actividad
> 2 lo pasamos a React con Vite y React Router, y rehicimos la interfaz
> completa. Lo que quiero mostrar hoy no es solo que funciona, sino algo más
> concreto: **cambiar de framework nos costó reescribir la interfaz y nada
> más**. La capa de dominio, los 26 archivos con las reglas del negocio, no se
> tocó. Y puedo demostrarlo en la terminal.»

No adelantes la demostración: la dejas para el cierre. Es el punto fuerte.

---

## 2. Recorrido por la aplicación (3 min)

Cinco rutas y un 404. Habla mientras haces clic; no leas la pantalla: explica
qué decide cada cosa.

| Ruta | Pantalla | Qué se enseña |
|---|---|---|
| `/` | Home | Propuesta de valor y accesos |
| `/productos` | Catálogo | Búsqueda, filtros, orden |
| `/simulador` | Simulador | Cuota automática y amortización |
| `/solicitar` | Solicitud | Formulario controlado por pasos |
| `/ayuda` | Ayuda | Preguntas frecuentes, `.map()` sobre datos |
| cualquier otra | 404 | Ruta comodín de React Router |

### 2.1 Home (`/`)

- «La portada presenta los productos y lleva a las tres acciones: ver el
  catálogo, simular y solicitar. Es una página nueva del rediseño; el catálogo
  se movió a `/productos`.»

### 2.1 bis Identidad visual — responde a la revisión anterior

Dilo tú antes de que lo pregunten, y en una frase:

> «La revisión de la Actividad 1 señaló que el diseño estaba saturado: banner
> con blanco, verde y azul, y seis degradados distintos en las tarjetas. La
> rehicimos con tres colores: azul corporativo, gris y un verde reservado a los
> avisos de éxito. Las seis paletas siguen declaradas en el dominio, porque el
> tema es un atributo del producto, pero la interfaz las resuelve todas al mismo
> azul: son seis selectores en el archivo de tokens.»

El punto que cierra el argumento: **el rediseño no tocó el dominio, ni un caso
de uso**.

### 2.2 Catálogo (`/productos`) — búsqueda y filtros

- «Seis productos. Cada tarjeta es el componente `CreditCard`, el mismo que se
  reutiliza abajo en el simulador con la variante compacta.»
- Teclea `vehi` **despacio**: «se filtra mientras escribo, sin pulsar nada ni
  esperar. El contador dice *1 de 6*.»
- Cambia el rango de monto y luego pulsa **Limpiar filtros**.
- «Las cifras llegan **ya formateadas** desde la capa de aplicación. El
  componente no formatea dinero: recibe `"$ 1.000.000 – $ 30.000.000"` como
  texto.»

### 2.3 Simulador (`/simulador`) — la cuota y el orden

- Cambia el **monto** a `20000000` y el **plazo** a `36`. Señala la cuota y **di
  la cifra en voz alta con su formato**: «un millón doscientos… en pesos
  colombianos, con separador de miles y sin decimales.»
- «Fíjense en que **no hay botón de calcular**. Cambio el plazo y la cuota se
  recalcula. Eso es un `useEffect` que depende del objeto del formulario.»
- Cambia el **producto** a Vivienda: «cambia la tasa, y el monto y el plazo se
  ajustan a los límites del nuevo producto.»
- Pon un monto inválido, por ejemplo `100` en Vivienda: «el resultado desaparece
  y aparece el mensaje por campo. Ese texto **no está escrito en el
  componente**: lo produce el dominio y la interfaz solo lo pinta.»
- Cambia el orden a *Tasa más baja*: «el orden lo decide la interfaz; el filtro
  por monto, el dominio. Explico por qué en un minuto.»
- Abre la **tabla de amortización** y alterna resumen anual / detalle mensual:
  «240 filas para un crédito de vivienda no le sirven a nadie de golpe, así que
  el nivel por defecto es el resumen anual.»

### 2.4 Solicitud (`/solicitar`) — formulario controlado

- Escribe `123` en Cédula y `juan@` en Email: «validación en vivo, campo a
  campo, y solo en los campos que ya toqué: un formulario recién abierto no
  aparece todo en rojo.»
- Completa el formulario con datos válidos y envía: «radicado, aviso al usuario
  y el formulario queda limpio.»

### 2.5 Ayuda (`/ayuda`) y ruta inexistente

- «Las preguntas frecuentes por producto se recorren con `.map()` sobre el mismo
  catálogo: no hay una lista duplicada a mano.»
- Ve a `/cualquier-cosa`: «404 propia, y la navegación sigue funcionando.»

---

## 3. Recorrido de archivos — ocho paradas (5 min)

Una parada por criterio de la rúbrica. **No abras más archivos que estos ocho**:
es mejor explicar ocho bien que enseñar quince. Cada parada son ~35 segundos:
abrir la pestaña, señalar la línea, decir las dos o tres frases.

| # | Archivo | Criterio de la rúbrica | Frase que tienes que decir sí o sí |
|---|---|---|---|
| 1 | `vite.config.js` + árbol de `src/` | Configuración y estructura | «Vite, y una carpeta por responsabilidad» |
| 2 | `src/main.jsx` | Configuración y estructura | «Aquí se monta React y se envuelve en el router» |
| 3 | `src/App.jsx` + `src/config/routes.js` | React Router | «Una `<Route>` por pantalla y un comodín para el 404» |
| 4 | `src/components/CreditCard.jsx` | Componentes y props | «Props desestructuradas en la firma» |
| 5 | `src/hooks/useCreditSearch.js` | `useState` + búsqueda y filtros | «Un `useState` por cosa que cambia, y cada tecla relanza la búsqueda» |
| 6 | `src/pages/SimulatorPage.jsx` + `useProductSorting.js` | Arrays | «`.sort()`, `.filter()` y `.map()` con `key` única» |
| 7 | `src/domain/services/CreditSimulationService.js` | Cálculo de cuota | «La fórmula del sistema francés vive en un solo sitio» |
| 8 | `src/hooks/useApplicationForm.js` | Formulario controlado | «Las reglas que validan al teclear son las que validan al enviar» |

### Parada 1 — `vite.config.js` y la estructura de carpetas

```js
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: true },
});
```

Enseña el árbol en el explorador del editor y léelo en voz alta:

```
src/
  components/   21 componentes de presentación, uno por archivo
  pages/        6 páginas, una por ruta
  hooks/        8 hooks: el estado de la interfaz
  data/         creditsData.js — el catálogo
  config/       rutas y grafo de dependencias
  domain/ application/ infrastructure/   la arquitectura hexagonal
```

Qué decir:
- «Elegimos **Vite**, la opción recomendada en el enunciado: arranca en menos de
  un segundo y empaqueta a HTML, CSS y JS estáticos.»
- «`components/`, `pages/` y `data/` son las tres carpetas que pide la
  actividad. Las otras tres vienen de la Actividad 1 y no se tocaron.»
- «Un componente por archivo, y el archivo se llama como el componente.»

### Parada 2 — `src/main.jsx`, el punto de arranque

```jsx
createRoot(mountPoint).render(
  <StrictMode>
    <DependenciesProvider container={container}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DependenciesProvider>
  </StrictMode>,
);
```

Qué decir:
- «Tres cosas y ninguna más: construye las dependencias, monta React y envuelve
  la aplicación en `BrowserRouter`. Sin ese envoltorio no habría rutas.»
- «`StrictMode` monta dos veces a propósito en desarrollo, para destapar
  efectos mal limpiados. Volveré a esto en la parada 5.»

### Parada 3 — `src/App.jsx` y `src/config/routes.js` → React Router

```jsx
<Routes>
  <Route path={ROUTES.CATALOG} element={<HomePage />} />
  <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
  <Route path={ROUTES.SIMULATOR} element={<SimulatorPage />} />
  <Route path={ROUTES.APPLICATION} element={<ApplicationPage />} />
  <Route path={ROUTES.HELP} element={<HelpPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

```js
export const ROUTES = Object.freeze({
  CATALOG: '/', PRODUCTS: '/productos', SIMULATOR: '/simulador',
  APPLICATION: '/solicitar', HELP: '/ayuda',
});
```

Qué decir:
- «Cinco rutas y un comodín `*` para el 404. La barra y el pie están **fuera**
  de `<Routes>`: son iguales en las seis pantallas, así que repetirlos en cada
  página solo abriría la puerta a que se desincronizaran.»
- «Las rutas están en un archivo que **no importa nada**. `Navbar` necesita las
  rutas y las páginas necesitan a `Navbar`: si las rutas vivieran en `App.jsx`,
  eso sería una dependencia circular.»
- Abre `Navbar.jsx` un segundo: «la navegación usa `<NavLink to={...}>`, no
  `<a href>`. Con `<a>` el navegador recargaría la página entera y se perdería
  el estado; con `NavLink` React Router cambia solo el contenido y además marca
  el enlace activo.»

### Parada 4 — `src/components/CreditCard.jsx` → componentes y props

```jsx
export function CreditCard({ product, variant = 'full', badge = '' }) {
  const { name, description, requirements, icon, themeClass,
          annualRateLabel, maxTermMonths, maxTermLabel, amountRangeLabel } = product;
```

Qué decir:
- «Props **desestructuradas en la firma**, con valores por defecto, y el DTO
  desestructurado dentro.»
- «`variant` es lo que hace el componente reutilizable: la misma tarjeta se
  pinta completa en el catálogo y compacta en el simulador.»
- «Es un componente **sin estado y sin efectos**: recibe props y devuelve JSX.
  Si necesitara recordar algo, ese algo pertenece a la página o a un hook.»

### Parada 5 — `src/hooks/useCreditSearch.js` → `useState`, búsqueda y filtros

```js
const [query, setQuery] = useState('');
const [rangeIndex, setRangeIndex] = useState(ALL_AMOUNTS);
const [products, setProducts] = useState([]);
const [matched, setMatched] = useState(0);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  let cancelled = false;

  async function search() {
    const result = await searchCreditProducts.execute({ query, amountRangeIndex: rangeIndex });
    if (cancelled) return;
    setProducts(result.value.products);
    setMatched(result.value.matched);
  }

  search();
  return () => { cancelled = true; };
}, [query, rangeIndex, searchCreditProducts, notifier]);

const clearFilters = useCallback(() => {
  setQuery('');
  setRangeIndex(ALL_AMOUNTS);
}, []);
```

Qué decir:
- «Un `useState` por cosa que cambia, cada uno con su nombre y su valor inicial
  del tipo correcto: cadena vacía para el texto, array vacío para la lista,
  cero para el contador.»
- «El efecto depende de `query` y de `rangeIndex`: **cada tecla relanza la
  búsqueda**. No hay botón de buscar ni espera.»
- «`clearFilters` devuelve los dos estados a su valor inicial, y como el efecto
  depende de ellos, la lista se repuebla sola.»
- «`cancelled` en la limpieza: React monta dos veces en modo estricto y el
  usuario teclea más rápido de lo que responden las promesas. Sin esto, una
  respuesta vieja puede sobrescribir el estado más nuevo.»
- «El filtrado **no se hace aquí**: el criterio lo resuelve el dominio. Este
  hook solo traduce estado de interfaz en una llamada al caso de uso.»

### Parada 6 — `SimulatorPage.jsx` + `useProductSorting.js` → arrays

```js
const sortedProducts = useMemo(
  () => [...products].sort(COMPARATORS[sortBy] ?? COMPARATORS.name),
  [products, sortBy],
);

const visibleProducts = useMemo(
  () => sortedProducts.filter(
    (p) => !hideSimulated || String(p.id) !== String(form.productId)),
  [sortedProducts, hideSimulated, form.productId],
);

{visibleProducts.map((product) => (
  <CreditCard key={product.id} product={product} variant="compact" />
))}
```

Qué decir:
- «La cadena completa: el **dominio** filtra por criterio de negocio, la interfaz
  ordena, filtra por visibilidad y recorre.»
- «`[...products]` porque los DTOs llegan **congelados** y `.sort()` muta el
  array que recibe.»
- «La `key` es `product.id`, **no el índice**. Con el índice, al reordenar,
  React reutilizaría el nodo equivocado en cada posición y el foco o el scroll
  se aplicarían a la tarjeta errónea.»

### Parada 7 — `CreditSimulationService.js` → el cálculo de la cuota

```js
static monthlyInstallmentAmount(principal, monthlyRate, months) {
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
```

Qué decir:
- «Sistema francés, cuota fija. La tasa efectiva anual del producto se convierte
  a mensual equivalente y se aplica esta fórmula. Es el **único sitio del
  proyecto** donde aparece.»
- «Se calcula con la tasa del producto seleccionado: al cambiar de producto
  cambia la cuota, como vieron en la demo.»
- «El formato en pesos lo pone `IntlMoneyFormatter`, con
  `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })` y sin
  decimales. El componente recibe la cadena ya formateada.»
- «No está en el componente **a propósito**: es la regla más importante del
  sistema, está cubierta por la suite de pruebas y la comparte cualquier interfaz
  que se conecte.»

### Parada 8 — `useApplicationForm.js` → formulario controlado

```js
const [values, setValues] = useState(EMPTY_FORM);
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});

useEffect(() => {
  let cancelled = false;
  (async () => {
    const result = await validateApplicationDraft.execute(values);
    if (!cancelled) setErrors(result.isSuccess ? {} : result.fieldErrors);
  })();
  return () => { cancelled = true; };
}, [values, validateApplicationDraft]);

const errorFor = useCallback(
  (name) => (touched[name] ? (errors[name] ?? '') : ''),
  [errors, touched],
);
```

Qué decir — **este es el punto técnico más fuerte de la entrega**:
- «Formulario 100 % controlado: el valor de cada campo sale de `values` y cada
  pulsación pasa por `setValues`. El DOM no guarda nada por su cuenta.»
- «La rúbrica pide validación en tiempo real de correo, cédula y montos. Lo
  fácil es escribir esos `if` en el componente. Pero entonces hay **dos
  verdades** sobre qué es válido: la del formulario y la del dominio, y algún día
  se desincronizan.»
- «Creamos un caso de uso, `ValidateCreditApplicationDraftUseCase`, que valida el
  borrador reutilizando los mismos value objects que validan al enviar, y **sin
  persistir nada**. El mensaje que ve el usuario mientras escribe es literalmente
  el que produjo el dominio.»
- «`errorFor` es lo que evita que el formulario aparezca todo en rojo al
  abrirlo: solo muestra el error de un campo que el usuario ya tocó.»
- «Y al enviar: `onSubmit` previene el comportamiento por defecto, radica la
  solicitud, avisa y `reset()` deja el formulario limpio.»

---

## 4. Cierre — la demostración en la terminal (2 min)

Aquí se cobra la promesa de la apertura. Corre esto **en vivo**:

```bash
node tests/01-domain-application.mjs      # 85 aserciones -> TODO OK
```

> «Estas 85 aserciones cubren entidades, value objects, el servicio que calcula
> la cuota, los casos de uso y los DTOs. Es la misma suite de la Actividad 1,
> ejecutándose **sin haber cambiado una línea**, después de reescribir la
> interfaz completa. Corre en Node, sin navegador: el negocio no depende de
> React.»

```bash
grep -rn "infrastructure" src/components src/pages src/hooks src/context src/App.jsx
```

> «Cero resultados: ningún componente importa infraestructura. Y no es
> disciplina nuestra: el proveedor de dependencias entrega un objeto congelado
> **solo con casos de uso**, así que un componente no puede pedir un repositorio
> porque no está ahí.»

Cierra con el resumen de una frase:

> «Misma capa de negocio, dos interfaces. El dominio quedó en 26 archivos sin
> cambios, la aplicación creció en un caso de uso y la infraestructura perdió
> uno, el router, que ahora hace React Router. Migrar fue **cambiar un
> adaptador**, y eso es exactamente lo que la arquitectura hexagonal promete.»

---

## 5. Preguntas probables y cómo responderlas

| Pregunta | Respuesta corta |
|---|---|
| **¿Por qué Vite y no Create React App?** | Es la opción recomendada en el enunciado, arranca en menos de un segundo y su salida es HTML, CSS y JS estáticos: los sirve el mismo Apache de Laragon que ya servía la Actividad 1. |
| **¿Cómo está organizada la carpeta `src/`?** | `components/` para presentación sin estado, `pages/` una por ruta, `hooks/` para el estado de la interfaz, `data/` con el catálogo, `config/` con rutas y dependencias, y las tres capas de la arquitectura hexagonal heredadas de la Actividad 1. |
| **¿Cómo está montado el enrutado?** | `BrowserRouter` en `main.jsx`, la tabla de `<Route>` en `App.jsx`, las rutas como constantes en `config/routes.js` y la navegación con `<NavLink to={...}>`. El comodín `*` da el 404. |
| **¿Dónde está el estado de la aplicación? ¿Por qué no Redux?** | En hooks propios, uno por pantalla. No hay estado global compartido entre pantallas, así que Redux o Context para datos sería complejidad sin beneficio. El único Context que usamos entrega dependencias, no datos. |
| **¿Por qué el orden se decide en la interfaz y el filtro por monto en el dominio?** | Que un producto de $5.000.000 pertenezca al rango «hasta $5.000.000» es una afirmación sobre el negocio y debe responderse igual en cualquier cliente. En qué orden se listan los resultados es una preferencia de presentación. |
| **¿Por qué la cuota no se calcula en el componente?** | Porque es la regla más importante del sistema. Vive en `CreditSimulationService`, es el único sitio donde aparece la fórmula del sistema francés, está cubierta por la suite y la comparte cualquier interfaz que se conecte. |
| **¿Cómo se calcula la cuota?** | Sistema francés: la tasa efectiva anual se convierte en mensual equivalente, `i = (1+EA)^(1/12) − 1`, y `cuota = capital · i / (1 − (1+i)^−n)`. Los intereses se calculan sobre el saldo pendiente y la última cuota absorbe el ajuste por redondeo al peso. |
| **¿Y el formato en pesos?** | `IntlMoneyFormatter`, un adaptador sobre `Intl.NumberFormat` con locale `es-CO`, moneda `COP` y cero decimales. Es infraestructura, no dominio: la moneda es una decisión de presentación. |
| **¿Por qué un caso de uso solo para validar?** | Para no duplicar las reglas. Reutiliza los value objects que validan al enviar, así que no puede haber discrepancia entre lo que se avisa al escribir y lo que se rechaza al radicar. |
| **¿Qué pasa si mañana los productos vienen de una API?** | Es un adaptador nuevo que implemente `ICreditProductRepository` y una línea en `config/dependencies.js`. Ni el dominio, ni los casos de uso, ni un solo componente cambian. |
| **¿Por qué `key={product.id}` y no el índice?** | React usa la key para decidir qué nodos reutiliza. Con el índice, al reordenar conservaría el nodo equivocado en cada posición y el foco, el scroll o las animaciones se aplicarían a la tarjeta errónea. |
| **¿Para qué el `cancelled` en los efectos?** | React monta dos veces en modo estricto y el usuario puede teclear más rápido de lo que responden las promesas. Sin la limpieza, una respuesta vieja puede sobrescribir el estado más nuevo. |
| **¿Dónde quedó la Actividad 1?** | En el tag `ev1-entrega` de la misma historia del repositorio: sigue siendo reproducible tal como se entregó. |
| **¿Y las pruebas?** | `tests/01-domain-application.mjs` cubre dominio y aplicación con 85 aserciones, y `tests/02-boot-jsdom.mjs` comprueba el arranque. La interfaz se verifica con `npm run build` y con la comprobación manual documentada en el §17 del documento. |
| **¿Por qué quitaron los colores de las tarjetas?** | Porque no informaban de nada: los productos ya se distinguen por nombre, pictograma, tasa y rango de montos. Seis degradados en la misma rejilla saturan la pantalla, y en banca eso resta credibilidad. El color quedó reservado a la acción principal y a los estados. |
| **¿Y si mañana quieren volver a distinguir productos por color?** | Es el mismo bloque de tokens de `02-tokens.css`. El dominio sigue declarando las seis paletas en `ProductTheme`, así que el dato está ahí: solo cambia cómo se pinta. |
| **¿Cuánto de esto es código propio?** | La arquitectura, el enrutado, el simulador, las validaciones, los hooks y las pruebas. Del sitio de referencia se replicaron textos, productos, colores y puntos de quiebre, y así está declarado en las referencias del documento. |

---

## 6. Reparto entre los dos integrantes (sugerido)

| Momento | Quién | Minutos |
|---|---|---|
| Apertura y recorrido por la aplicación (§1–§2) | Integrante A | 3,5 |
| Paradas 1–4: configuración, arranque, rutas y componentes | Integrante B | 2,5 |
| Paradas 5–8: estado, arrays, cuota y formulario | Integrante A | 2,5 |
| Cierre en la terminal y frase final (§4) | Integrante B | 2 |
| Preguntas (§5) | Responde quien tocó ese archivo | — |

Regla: **quien escribió un archivo responde por ese archivo**. Es lo que espera
una revisión de código, y evita que uno de los dos quede sin poder explicar algo.

---

## 7. Errores a evitar en la sustentación

- Leer la pantalla en voz alta. Explica **qué decide** cada pieza, no qué dice.
- Abrir archivos fuera de las ocho paradas. Ocho bien explicadas puntúan más
  que quince a la carrera.
- Saltarse las paradas 1, 2 y 3 por ir con prisa: **son el criterio de mayor
  peso de la rúbrica** (configuración, estructura y React Router).
- Decir «esto lo genera la herramienta» de algo que sí escribieron ustedes.
- Dejar la demostración de la terminal para el final… y quedarse sin tiempo.
  Si vas justo, **sacrifica la parada 6 antes que el §4**.
- Prometer que algo funciona sin haberlo probado esa mañana. Corre `npm run dev`
  y la suite antes de conectarte.
