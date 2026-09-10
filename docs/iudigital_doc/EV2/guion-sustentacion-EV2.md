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

Ten abiertas, en este orden, estas pestañas y ventanas:

| # | Qué | Para qué |
|---|---|---|
| 1 | Navegador en `http://localhost:5173` | La demo |
| 2 | Editor con `src/hooks/useSimulation.js` | Mostrar código de estado |
| 3 | Editor con `src/components/CreditCard.jsx` | Mostrar props desestructuradas |
| 4 | Editor con `src/pages/SimulatorPage.jsx` | Mostrar `.filter().sort().map()` |
| 5 | Editor con `src/hooks/useApplicationForm.js` | Mostrar formulario controlado |
| 6 | Terminal libre | Correr la suite y los tres `grep` en vivo |

Comprobación de un minuto antes de entrar: recarga `/simulador`, teclea en el
buscador y cambia el monto. Si eso funciona, la demo funciona.

**Limpia el localStorage** antes de empezar (DevTools → Application → Local
Storage → borrar), para que la solicitud que radiques en vivo sea la primera.

---

## 1. Apertura — la frase que ordena toda la sustentación (30 s)

> «CreditSmart ya existía: en la Actividad 1 lo construimos en HTML, CSS y
> JavaScript sin frameworks, sobre una arquitectura hexagonal. Para la Actividad
> 2 lo pasamos a React. Lo que quiero mostrar hoy no es solo que funciona, sino
> algo más concreto: **cambiar de framework nos costó reescribir la interfaz y
> nada más**. La capa de dominio, los 26 archivos con las reglas del negocio, no
> se tocó. Y puedo demostrarlo en la terminal.»

No adelantes la demostración: la dejas para el cierre. Es el punto fuerte.

---

## 2. Recorrido por la aplicación (3 min)

Habla mientras haces clic. No leas la pantalla: explica qué decide cada cosa.

### 2.1 Catálogo (`/`)

- «Seis productos. Cada tarjeta es el componente `CreditCard`, el mismo que se
  reutiliza abajo en el simulador con la variante compacta.»
- «Las cifras llegan **ya formateadas** desde la capa de aplicación. El
  componente no formatea dinero: recibe `"$ 1.000.000 – $ 30.000.000"` como
  texto.»

### 2.2 Simulador (`/simulador`) — el criterio de la cuota

- Cambia el **monto** a `20000000` y el **plazo** a `36`. Señala la cuota.
- «Fíjense en que **no hay botón de calcular**. Cambio el plazo y la cuota se
  recalcula. Eso es un `useEffect` que depende del objeto del formulario.»
- Cambia el **producto** a Vivienda: «cambia la tasa, y el monto y el plazo se
  ajustan a los límites del nuevo producto.»
- Pon un monto inválido, por ejemplo `100` en Vivienda: «el resultado
  desaparece y aparece el mensaje por campo. Ese texto **no está escrito en el
  componente**: lo produce el dominio y la interfaz solo lo pinta. Vuelvo en un
  momento a este punto.»
- Abre la **tabla de amortización** y alterna resumen anual / detalle mensual:
  «240 filas para un crédito de vivienda no le sirven a nadie de golpe, así que
  el nivel por defecto es el resumen anual.»

### 2.3 Búsqueda, filtros y orden

- Teclea `vehi` **despacio**: «se filtra mientras escribo, sin pulsar nada. El
  contador dice *1 de 6*.»
- Cambia el rango de monto y luego **Limpiar filtros**.
- Cambia el orden a *Tasa más baja*: «el orden lo decide la interfaz; el filtro
  por monto, el dominio. Explico por qué en un minuto.»

### 2.4 Solicitud (`/solicitar`) — formulario controlado

- Escribe `123` en Cédula y `juan@` en Email: «validación en vivo, campo a
  campo, y solo en los campos que ya toqué: un formulario recién abierto no
  aparece todo en rojo.»
- Completa el formulario con datos válidos y envía: «radicado, aviso al usuario
  y el formulario queda limpio.»

### 2.5 Ruta inexistente

- Ve a `/cualquier-cosa`: «404 propia, y la navegación sigue funcionando.»

---

## 3. El código, criterio por criterio de la rúbrica (4 min)

Cuatro archivos, uno por criterio. No abras más: es mejor explicar cuatro bien
que enseñar quince.

### 3.1 Componentes y props → `src/components/CreditCard.jsx`

```jsx
export function CreditCard({ product, variant = 'full' }) {
  const { name, description, requirements, icon, themeClass,
          annualRateLabel, maxTermMonths, maxTermLabel, amountRangeLabel } = product;
```

Qué decir:
- «Props **desestructuradas** en la firma, y el DTO desestructurado dentro.»
- «Un componente por archivo, y **sin estado**: si necesitara recordar algo, ese
  algo pertenece a la página o a un hook.»
- «Recibe un **DTO**, no la entidad de dominio. Si recibiera la entidad podría
  invocar reglas de negocio desde la vista, y esa decisión dejaría de estar en un
  solo sitio.»

### 3.2 Estado con hooks → `src/hooks/useSimulation.js`

```js
useEffect(() => {
  if (!form.productId) return undefined;
  let cancelled = false;

  async function simulate() {
    const result = await simulateCredit.execute({ ... });
    if (cancelled) return;
    if (result.isFailure) { setSimulation(null); setErrors(result.fieldErrors); }
    else { setSimulation(result.value); setErrors({}); }
  }

  simulate();
  return () => { cancelled = true; };
}, [form, simulateCredit]);
```

Qué decir:
- «Este hook es el equivalente del controlador que teníamos en la Actividad 1:
  guarda el estado de la interfaz e invoca el caso de uso.»
- «Un solo efecto cubre producto, monto y plazo, porque la dependencia es el
  objeto `form` completo.»
- «`cancelled` en la limpieza: React monta dos veces en modo estricto, y sin eso
  una respuesta vieja podría sobrescribir una nueva.»
- «El hook es el **único** que ve un `Result`. Fuera de aquí solo circulan datos
  planos, así que ningún componente puede equivocarse interpretando un fallo.»

### 3.3 Arrays → `src/pages/SimulatorPage.jsx` + `src/hooks/useProductSorting.js`

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
- «La `key` es `product.id`, no el índice. Con el índice, al reordenar, React
  reutilizaría el nodo equivocado en cada posición y el foco o el scroll se
  aplicarían a la tarjeta errónea.»

### 3.4 Formulario controlado → `src/hooks/useApplicationForm.js`

```js
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
- «La rúbrica pide validación en tiempo real de correo, cédula y montos. Lo
  fácil es escribir esos `if` en el componente. Pero entonces hay **dos
  verdades** sobre qué es válido: la del formulario y la del dominio, y algún día
  se desincronizan.»
- «Creamos un caso de uso, `ValidateCreditApplicationDraftUseCase`, que valida el
  borrador reutilizando los mismos value objects que validan al enviar, y **sin
  persistir nada**. Doce líneas.»
- «El mensaje que ve el usuario mientras escribe es literalmente el que produjo
  el dominio. Las reglas que validan al teclear son las mismas que validan al
  radicar.»
- «Y `errorFor` es lo que evita que el formulario aparezca todo en rojo al
  abrirlo: solo muestra el error de un campo que el usuario ya tocó.»

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
| **¿Dónde está el estado de la aplicación? ¿Por qué no Redux?** | En hooks propios, uno por pantalla. No hay estado global compartido entre pantallas, así que Redux o Context para datos sería complejidad sin beneficio. El único Context que usamos entrega dependencias, no datos. |
| **¿Por qué el orden se decide en la interfaz y el filtro por monto en el dominio?** | Que un producto de $5.000.000 pertenezca al rango «hasta $5.000.000» es una afirmación sobre el negocio y debe responderse igual en cualquier cliente. En qué orden se listan los resultados es una preferencia de presentación. |
| **¿Por qué la cuota no se calcula en el componente?** | Porque es la regla más importante del sistema. Vive en `CreditSimulationService`, es el único sitio donde aparece la fórmula del sistema francés, está cubierta por la suite y la comparte cualquier interfaz que se conecte. |
| **¿Cómo se calcula la cuota?** | Sistema francés: la tasa efectiva anual se convierte en mensual equivalente, `i = (1+EA)^(1/12) − 1`, y `cuota = capital · i / (1 − (1+i)^−n)`. Los intereses se calculan sobre el saldo pendiente y la última cuota absorbe el ajuste por redondeo al peso. |
| **¿Por qué un caso de uso solo para validar?** | Para no duplicar las reglas. Reutiliza los value objects que validan al enviar, así que no puede haber discrepancia entre lo que se avisa al escribir y lo que se rechaza al radicar. |
| **¿Qué pasa si mañana los productos vienen de una API?** | Es un adaptador nuevo que implemente `ICreditProductRepository` y una línea en `config/dependencies.js`. Ni el dominio, ni los casos de uso, ni un solo componente cambian. |
| **¿Por qué `key={product.id}` y no el índice?** | React usa la key para decidir qué nodos reutiliza. Con el índice, al reordenar conservaría el nodo equivocado en cada posición y el foco, el scroll o las animaciones se aplicarían a la tarjeta errónea. |
| **¿Para qué el `cancelled` en los efectos?** | React monta dos veces en modo estricto y el usuario puede teclear más rápido de lo que responden las promesas. Sin la limpieza, una respuesta vieja puede sobrescribir el estado más nuevo. |
| **¿Dónde quedó la Actividad 1?** | En el tag `ev1-entrega` de la misma historia del repositorio: sigue siendo reproducible tal como se entregó. |
| **¿Y las pruebas de la interfaz?** | La suite de dominio y aplicación sigue vigente. Las dos suites que probaban plantillas de cadena y arranque con jsdom se retiraron porque probaban código que ya no existe; su papel lo cubren `npm run build` y la comprobación manual documentada en el §17 del documento. |
| **¿Cuánto de esto es código propio?** | La arquitectura, el enrutado, el simulador, las validaciones, los hooks y las pruebas. Del sitio de referencia se replicaron textos, productos, colores y puntos de quiebre, y así está declarado en las referencias del documento. |

---

## 6. Reparto entre los dos integrantes (sugerido)

| Momento | Quién | Minutos |
|---|---|---|
| Apertura y recorrido por la aplicación (§1–§2) | Integrante A | 3,5 |
| Componentes, props y arrays (§3.1, §3.3) | Integrante B | 2 |
| Estado con hooks y formulario controlado (§3.2, §3.4) | Integrante A | 2 |
| Cierre en la terminal y frase final (§4) | Integrante B | 2 |
| Preguntas (§5) | Responde quien tocó ese archivo | — |

Regla: **quien escribió un archivo responde por ese archivo**. Es lo que espera
una revisión de código, y evita que uno de los dos quede sin poder explicar algo.

---

## 7. Errores a evitar en la sustentación

- Leer la pantalla en voz alta. Explica **qué decide** cada pieza, no qué dice.
- Abrir quince archivos. Cuatro archivos bien explicados puntúan más.
- Decir «esto lo genera la herramienta» de algo que sí escribieron ustedes.
- Dejar la demostración de la terminal para el final… y quedarse sin tiempo.
  Si vas justo, **sacrifica el §3.3 antes que el §4**.
- Prometer que algo funciona sin haberlo probado esa mañana. Corre `npm run dev`
  y la suite antes de conectarte.
