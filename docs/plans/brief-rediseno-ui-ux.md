# Brief de rediseño UI/UX — CreditSmart

> **Documento de entrada para un agente de rediseño.**
> Describe el estado actual del front (funcionalidad, estructura, sistema
> visual), las restricciones que no son negociables y el encargo concreto.
> Última actualización: 2026-09-12 · rama `ev2-react` · versión 2.0.0.

---

## 0. TL;DR para el agente

CreditSmart es una web de productos de crédito (catálogo + simulador de cuota +
formulario de solicitud), hecha para una asignatura de **maquetación
HTML5/CSS3**. Ya existe y funciona. Lo que se pide **no** es reescribirla: es
elevar la calidad visual y de experiencia de usuario **dentro** de una
restricción muy concreta —sobriedad de banca, paleta corporativa de 2–3
colores, CSS3 plano sin frameworks— y entregar recursos accionables (tokens,
especificaciones de componentes, jerarquías, microcopy, estados, accesibilidad,
responsive).

El trabajo debe poder aplicarse **tocando solo `assets/css/*.css` y el marcado
de los componentes de presentación**. Ni dominio, ni casos de uso, ni
infraestructura.

---

## 1. Contexto académico y la crítica que origina este encargo

El proyecto se entrega en una asignatura cuyo foco es **maquetación limpia con
HTML5 estático y CSS3 bien estructurado**, no frameworks ni lógica JS avanzada.
La revisión del docente señaló tres cosas:

1. **Ceñirse al alcance pedido.** No se evaluaba un despliegue de lógica JS ni
   frameworks complejos. *«A veces menos es más.»*
2. **Diseño visual y coherencia de marca — el punto más crítico.** En el sector
   financiero la credibilidad lo es todo. La versión original mezclaba blanco,
   verde y azul en el banner, y tarjetas con degradados de *todos* los colores
   (morado, azul, verde, rojo, amarillo). Resultado: saturación visual que
   **haría dudar al usuario sobre la legitimidad del sitio**. Se exige
   sobriedad, paleta corporativa coherente (**máximo 2–3 colores principales**)
   y armonía visual.
3. **Orden de prioridades.** Primero los requisitos básicos con excelente
   calidad visual; los extras, encima de esa base sólida y sin descuidar la
   estética.

> **Importante para el agente:** el punto 2 **ya fue atendido parcialmente** en
> el commit `e615c71` («style: rediseña la interfaz con una paleta corporativa
> sobria»). Lo que se describe en la §5 de este documento es el estado **ya
> corregido**, no el original. No hay que volver a «quitar el arcoíris»: eso
> está hecho. El encargo ahora es **subir el listón**: que la sobriedad actual
> deje de parecer austeridad y pase a leerse como diseño financiero
> deliberado, con jerarquía, ritmo y pulido.
>
> El historial del rediseño y su justificación están en
> [`docs/22-identidad-visual.md`](../22-identidad-visual.md).

---

## 2. Stack y estructura real del proyecto

| Aspecto | Realidad |
|---|---|
| Framework | React 19 + React Router 7, bundler Vite 8 |
| Estilos | **CSS3 plano**, 7 archivos en cascada explícita. Sin Tailwind, sin Sass, sin CSS-in-JS, sin librería de componentes |
| Tipografía | Pila del sistema (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto…`). **No hay webfont cargada** |
| Iconografía | Emojis del catálogo (desaturados con `filter: grayscale(1)`) + un único SVG inline (icono «home» del 404). **No hay set de iconos** |
| Imágenes | Ninguna, salvo el favicon remoto |
| Datos | Estáticos: 6 productos en `src/data/creditsData.js` |
| Arquitectura | Hexagonal + Clean Architecture. La presentación consume DTOs planos y formateados; **no** entidades |
| Idioma | Español (Colombia). Moneda COP |
| Tests | `node tests/01-domain-application.mjs` → debe imprimir `TODO OK` |

### Árbol relevante para el rediseño

```
index.html                       ← shell: #root, #notifications, .noscript
assets/css/
  01-reset.css      (175 líneas)  reset normalizado
  02-tokens.css     (198)         ÚNICA fuente de verdad visual
  03-base.css       ( 81)         body, focus, spinner, utilidades tipográficas
  04-layout.css     ( 99)         .page, .container, .section, grids, stacks
  05-components.css (580)         navbar, botones, card, panel, alert, form, footer, toast
  06-pages.css      (550)         hero, filtros, formulario, 404, simulador, tabla
  07-responsive.css ( 96)         breakpoints 640 / 1024 / max-400 + @media print
src/
  App.jsx                         tabla de rutas
  main.jsx                        composition root; importa los 7 CSS en orden
  config/routes.js                / · /simulador · /solicitar · *
  pages/      CatalogPage · SimulatorPage · ApplicationPage · NotFoundPage
  components/ Navbar · Footer · CreditCard · SearchBar · AmountRangeFilter ·
              SortSelect · Alert · SimulatorForm · SimulationResult ·
              AmortizationTable · FormField
  hooks/      useCreditProducts · useCreditSearch · useProductSorting ·
              useSimulation · useApplicationForm · useDocumentTitle
  data/creditsData.js             6 productos, 5 rangos de monto, 5 plazos
```

---

## 3. Restricciones no negociables

1. **Sin frameworks CSS ni librerías de UI.** El entregable es CSS3 escrito a
   mano. Si se propone una utilidad, se declara como clase en el archivo que le
   corresponde de la cascada.
2. **La cascada de los 7 archivos se respeta.** Un color nuevo entra por
   `02-tokens.css`; nunca un hex suelto dentro de un componente.
3. **Máximo 2–3 colores principales.** Hoy: azul corporativo + gris neutro +
   verde de estado (y rojo solo para error de validación). Ampliar esa cuenta
   exige justificarlo como *estado*, no como decoración.
4. **La presentación no puede importar `infrastructure/` ni entidades de
   dominio.** Trabaja con DTOs ya formateados (`CreditProductDTO`,
   `SimulationDTO`).
5. **El rediseño no debe exigir cambios en `domain/`, `application/` ni
   `infrastructure/`.** Precedente: los seis temas de color por producto viven
   en el dominio (`ProductTheme`) y se resuelven al azul corporativo con seis
   selectores en `02-tokens.css`. Cualquier decisión visual debe poder aislarse
   igual.
6. **Accesibilidad conservada o mejorada**: `aria-live` en resultados y toasts,
   `aria-invalid` + `aria-describedby` en campos, `role="alert"` en errores,
   `aria-expanded`/`aria-controls` en la tabla plegable, `aria-pressed` en los
   modos de detalle, `<caption>` y `scope` en las tablas, `.sr-only`,
   `:focus-visible` global.
7. **Mobile-first.** Breakpoints actuales: `640px` y `1024px`, más un ajuste en
   `max-width: 400px`. Hay `@media print`.
8. **Español, tono formal de banca.** Sin emojis en botones ni en títulos (el
   pictograma del producto sí se conserva: es un dato del catálogo).

---

## 4. Funcionalidad actual, pantalla por pantalla

### 4.1 `/` — Catálogo (`CatalogPage`)

Estructura: `Navbar` → `hero` → sección «Nuestros Productos» → grid de 6
tarjetas → `Footer variant="catalog"`.

- **Hero**: fondo azul oscuro con degradado vertical (`blue-800` → `blue-900`),
  titular a dos líneas («Tu crédito ideal, / en un solo lugar», la segunda en
  `blue-200` y peso medio), subtítulo, y dos botones: **«Simular Crédito»**
  (blanco sólido) y **«Solicitar Ahora»** (fantasma con borde blanco al 45 %).
- **Grid de productos**: 1 columna en móvil, 2 desde 640 px, 3 desde 1024 px.
- **Tarjeta `CreditCard variant="full"`**:
  - cabecera: chip de 44 px con el emoji desaturado + nombre + «Hasta N meses»;
  - cuerpo: descripción, fila de métricas (Tasa anual en grande / Plazo máx. a
    la derecha), badge del rango de montos, línea de requisitos;
  - pie: dos botones — «Ver detalles» (contorno azul, va a `/simulador`) y
    «Solicitar» (sólido, va a `/solicitar`).
- **Estados**: carga («Cargando el catálogo de productos…») y error, ambos
  renderizados como `alert--empty`.

### 4.2 `/simulador` — Simulador (`SimulatorPage`)

Dos bloques independientes en la misma página. Es la pantalla más densa y la
que más margen de mejora tiene.

**Bloque 1 — Simulador**

- `SimulatorForm` dentro de un `panel`: `<select>` de producto (etiquetado
  «Nombre — 14.2 % E.A.»), monto (`number`, `step=100000`, acotado al rango del
  producto) y plazo (`number`, acotado al plazo máximo). Tres columnas desde
  1024 px. Botón «Reiniciar» al pie.
- **No hay botón «Calcular»**: la cuota se recalcula en cada cambio.
- Hueco de error fijo bajo cada campo (`.field__error` con `min-height`) para
  que no salte el layout.
- `SimulationResult`: panel azul oscuro con cabecera (pictograma + nombre +
  «$X a N meses · 14.2 % (1.11 % m. v.)») y 4 métricas — **Cuota mensual**
  (destacada: única tarjeta blanca), Total en intereses, Total a pagar, Coste
  del crédito. Nota final si la última cuota absorbe el ajuste por redondeo.
  1 col → 2 col (640) → 4 col (1024).
- `AmortizationTable`: **plegada por defecto**, botón «Ver tabla de amortización
  (N cuotas)». Al abrir, dos modos: **Resumen anual** (por defecto) y **Detalle
  mensual**. Contenedor con `max-height: 26rem`, scroll propio, `thead` sticky,
  filas cebra, cifras tabulares.
- Si no hay simulación válida: `Alert variant="empty"` — «Completa el monto y el
  plazo para ver tu cuota.»

**Bloque 2 — Catálogo filtrable** (tras un `<hr class="sim-divider">`)

- Panel de filtros con 3 controles: `SearchBar` (busca mientras se escribe),
  `AmountRangeFilter` (5 rangos, derivados de un caso de uso, no escritos a
  mano) y `SortSelect`.
- Barra de acciones: checkbox «Ocultar el producto que estoy simulando» + botón
  «Limpiar filtros».
- `Alert variant="info"` explicando que la búsqueda se aplica mientras se
  escribe (**texto de tono académico, candidato claro a reescritura**).
- Contador «Mostrando N de M productos» cuando hay filtro activo.
- Grid de `CreditCard variant="compact"` (cabecera reducida, sin requisitos, un
  solo botón).
- Vacío: «Ningún producto coincide con los filtros aplicados.»

### 4.3 `/solicitar` — Solicitud (`ApplicationPage`)

- Contenedor estrecho (`--container-3xl`, 48 rem).
- Formulario de **11 campos** en 3 secciones declaradas como datos:
  1. **Datos Personales** — nombre completo, cédula, email, teléfono.
  2. **Datos del Crédito** — tipo de crédito (`select`, derivado del catálogo,
     ancho completo), monto, plazo (`select`: 12/24/36/48/60), destino
     (`textarea`, ancho completo).
  3. **Datos Laborales** — empresa, cargo, ingresos mensuales (ancho completo).
- Cada sección es un `form__section`: tarjeta blanca con filete azul claro de
  3 px a la izquierda, título y texto de ayuda.
- Grid de 1 col → 2 col desde 640 px. `full: true` ocupa la fila entera.
- **Validación en vivo** contra las reglas del dominio, pero el error de un
  campo **solo se muestra si el usuario ya lo tocó**. Al enviar se marcan todos
  los campos como tocados.
- Acciones: «Enviar solicitud» (primaria, ancho completo, pasa a «Enviando…»
  con `disabled`) y «Limpiar formulario» (contorno gris). En fila desde 640 px.
- Al radicar: toast de éxito con el nombre del solicitante + `Alert` persistente
  con el número de radicado.
- Nota al pie sobre campos obligatorios (`*` en rojo).

### 4.4 `*` — 404 (`NotFoundPage`)

Pantalla de sistema con **paleta slate distinta al resto del sitio** y **texto
en inglés** («Page Not Found», «Go Home»). Código 404 gigante en peso 300, regla
horizontal, ruta solicitada, botón con SVG de casa. Sin navbar ni footer.

**Incoherencia conocida: idioma y paleta rompen con el resto del sitio.**

### 4.5 Transversal

- **Navbar sticky**, 4 rem de alto, fondo blanco, borde inferior. Marca
  «Credit**Smart**» (dos tonos del mismo azul) + tagline «by FinTech Solutions»
  (oculto por debajo de 640 px). Tres enlaces; el activo con fondo azul claro;
  «Solicitar» se pinta como CTA sólido **solo cuando no es la ruta activa**.
- **Footer** azul `blue-900`, centrado, dos variantes (`catalog` / `compact`)
  que solo cambian el margen superior y la longitud de la segunda línea.
- **Toasts** abajo a la derecha, región `aria-live="polite"`, 6 s de vida, borde
  izquierdo de 4 px que codifica el tipo (éxito / error / info). Los inyecta un
  adaptador que escribe en `#notifications` con `textContent`.
- **Boot**: spinner a pantalla completa antes del montaje de React.
- **`<noscript>`** con aviso.
- **`@media print`** oculta navbar, footer, toasts y todas las acciones.

---

## 5. Sistema visual actual (punto de partida del rediseño)

### 5.1 Paleta

Azul corporativo, escala navy de una sola familia:

| Token | Valor | Uso actual |
|---|---|---|
| `--color-blue-50` | `#f4f7fb` | Fondo de avisos, chips, nav activo |
| `--color-blue-100` | `#e5ecf5` | Bordes suaves, halo de foco |
| `--color-blue-200` | `#c7d6e8` | Texto secundario sobre oscuro |
| `--color-blue-400` | `#7390b5` | — |
| `--color-blue-500` | `#45648f` | 2.º tono de marca, foco de controles |
| `--color-blue-600` | `#2d4c75` | — |
| `--color-blue-700` | `#1f3a5f` | **Marca**: botones, enlaces, cifras |
| `--color-blue-800` | `#182e4c` | Hover, fondo del hero |
| `--color-blue-900` | `#101f35` | Footer, base del degradado |

- Gris: escala `gray-50 … gray-900` estándar (tipo Tailwind).
- Slate: escala aparte, **solo** para el 404 y la pantalla de acceso.
- Verde de estado desaturado: `--success: #1f6654`. **Un solo uso**: borde del
  toast de éxito.
- Rojo: `#dc2626` error de validación, `#ef4444` borde de campo inválido, fondo
  `#fef2f2`.
- Violeta, ámbar, rosa y turquesa: **declarados pero sin uso en superficies**.
  Quedan como referencia del catálogo original.

Alias semánticos disponibles: `--page-bg`, `--surface`, `--surface-border`,
`--text-strong|body|muted|faint`, `--brand`, `--brand-hover`, `--brand-strong`,
`--brand-soft`, `--brand-soft-border`, `--brand-light`, `--accent` (= brand),
`--success`, `--focus-ring`, `--required`.

### 5.2 Tipografía

Escala `--text-xs` (0.75 rem) → `--text-7xl` (4.5 rem), cada una con su
`--leading-*`. Pesos 400 / 500 / 600 / 700 / 900. Titulares en 700 con
`letter-spacing: -0.015em`. **Sin webfont**: todo pila de sistema.

### 5.3 Otros tokens

- Radios: `md 4px · lg 6px · xl 8px · 2xl 10px · full`.
- Sombras: tres niveles, todas teñidas con `rgb(16 31 53 / …)`.
- Contenedores: `md 28rem · 2xl 42rem · 3xl 48rem · 4xl 56rem · 7xl 80rem`.
- Espaciado: escala 1–16 (`0.25rem` → `4rem`), sin valores 7, 9, 11, 13, 15.
- Motion: `--transition-fast 150ms`, `--transition-base 200ms`,
  `--ease cubic-bezier(.4,0,.2,1)`.
- Z-index: `--z-nav 50`, `--z-toast 100`.
- `font-variant-numeric: tabular-nums` en tasas, montos y tablas.

### 5.4 Inventario de clases CSS existentes

`.navbar` · `.brand` · `.navlink(--active|--cta)` · `.btn(--primary|--accent|--ghost-light|--outline|--outline-brand|--outline-gray|--block|--card|--system)`
· `.product-card(--compact)` + `__header|__icon|__name|__term|__body|__desc|__metrics|__requirements|__footer`
· `.metric__label|__value(--sm)` · `.badge-amount` · `.panel(--filters|--simulator)` + `__title|__hint`
· `.alert(--info|--empty)` · `.field` · `.label(--block)` · `.control(--select|--textarea|.is-invalid)`
· `.field__error` · `.form-actions` · `.form-note` · `.footer(--spaced)` · `.notifications`
· `.toast(--success|--error|--info)` · `.hero` + `__inner|__title|__title-accent|__subtitle|__actions`
· `.filters__grid|__actions|__toggle` · `.results-count` · `.form-page` · `.form` · `.form__section`
· `.sys-*` (404) · `.access-*` · `.sim-result` + `__header|__icon|__title|__meta|__grid|__note`
· `.sim-metric(--highlight)` · `.sim-schedule` + `__bar|__modes|__scroll` · `.sim-table` · `.sim-divider`
· utilidades `.t-*`, `.container--*`, `.stack--gap-*`, `.row--*`, `.grid-*`, `.sr-only`.

---

## 6. Problemas y oportunidades detectados (lista de trabajo sugerida)

Ordenados por impacto. El agente puede reordenar, ampliar o descartar con
justificación.

### Crítico — credibilidad y jerarquía

1. **La sobriedad se lee como austeridad.** La corrección de paleta fue
   correcta, pero el resultado es plano: superficies blancas, bordes de 1 px y
   sombras casi imperceptibles. Falta profundidad, ritmo vertical y un sistema
   de elevación que distinga lo primario de lo secundario.
2. **El hero no transmite confianza institucional.** Un degradado vertical y dos
   botones. No hay señales de legitimidad: sin cifras de respaldo, sin sellos de
   seguridad, sin propuesta de valor cuantificada, sin ilustración ni patrón de
   fondo. En banca, esas señales *son* el diseño.
3. **Tipografía de sistema sin escala editorial.** La pila de sistema es
   defendible por rendimiento, pero la jerarquía actual depende casi solo del
   tamaño. Falta contraste de peso, tracking y color entre niveles.
4. **Emojis como iconografía de producto.** Desaturarlos con
   `filter: grayscale(1)` es un parche: siguen siendo inconsistentes entre
   sistemas operativos y restan formalidad. Propuesta esperada: set de iconos
   SVG inline, monocromo, trazo uniforme, uno por producto. Debe poder mapearse
   al campo `icon` del catálogo sin tocar el dominio.

### Alto — experiencia de uso

5. **El simulador es la pantalla de mayor valor y está enterrada.** Vive en
   `/simulador`, tras el hero y por encima de un segundo catálogo. Evaluar
   llevar una versión reducida al hero o rediseñar la página para que el
   resultado sea lo primero que se vea.
6. **Dos catálogos en el sitio** (`/` completo y `/simulador` compacto) sin
   diferencia clara para el usuario. Decidir si se unifican, si el segundo se
   convierte en «comparador» o si desaparece.
7. **Entrada de monto y plazo por `<input type="number">`.** Para un simulador
   financiero, un *slider* con marcas, formato de miles en vivo y presets
   («$5 M», «$10 M», «$20 M») reduce fricción de forma drástica. Hoy el usuario
   debe teclear `5000000` sin separadores.
8. **El resultado de la simulación no se puede comparar.** Cuatro métricas y una
   tabla. No hay forma de comparar dos plazos o dos productos lado a lado, que
   es exactamente la decisión que el usuario está tomando.
9. **La tabla de amortización carece de lectura visual.** Solo números. Una
   barra apilada capital/interés por fila, o un gráfico de composición, comunica
   en un segundo lo que la tabla exige leer.
10. **El formulario de 11 campos se presenta de una vez.** Evaluar progresión
    por pasos con indicador de avance, o al menos un resumen lateral persistente
    de lo que se está solicitando. Hoy no hay ninguna señal de progreso.
11. **Sin puente entre simulador y solicitud.** Quien simula y decide solicitar
    reescribe producto, monto y plazo desde cero. El estado no viaja.
12. **Microcopy con tono académico.** El `Alert` del simulador dice: «La búsqueda
    se aplica *mientras escribes*: el criterio lo resuelve el dominio, no la
    interfaz». Explica la arquitectura al usuario final. Debe reescribirse todo
    el copy con voz de producto financiero.

### Medio — consistencia y pulido

13. **404 en inglés y con paleta slate ajena.** Traducir y alinear con el
    sistema, o justificar explícitamente por qué es una «pantalla de sistema».
14. **Estilos `.access-*` declarados sin pantalla que los use.** Decidir: o se
    diseña esa pantalla, o se retiran del CSS.
15. **Estados incompletos.** Hay carga y vacío, pero el «cargando» es texto plano
    dentro de un `alert--empty`. Faltan *skeletons*, estado de error con acción
    de reintento y estados `:disabled` definidos para los botones.
16. **Un solo tratamiento de foco y sin `prefers-reduced-motion`.** Hay
    `:focus-visible` global (bien) y `scroll-behavior: smooth` sin escape para
    quien reduce movimiento.
17. **Sin modo oscuro.** No es obligatorio, pero la arquitectura de tokens lo
    haría barato y es una señal de calidad.
18. **Breakpoints solo en 640 y 1024.** El salto de 2 a 3 columnas de tarjetas es
    brusco entre 1024 y 1440. No hay tratamiento para pantallas grandes:
    `--container-7xl` (80 rem) queda holgado a 1920 px.
19. **Sin tratamiento de foco/hover en la tarjeta como bloque.** Es clicable por
    sus botones, pero no comunica afordancia como unidad.
20. **`@media print` oculta acciones pero no está diseñado.** Una simulación
    impresa o en PDF es un caso de uso real en banca; hoy sale como la web sin
    botones.

---

## 7. Lo que se espera como entrega del agente de rediseño

Preferiblemente en este orden, y con todo lo visual expresado en **tokens CSS
que encajen en `02-tokens.css`**:

1. **Dirección de arte en una página**: principio rector, qué debe sentir el
   usuario en los primeros 3 segundos, y 3–5 referencias del sector con nota de
   qué se toma de cada una.
2. **Sistema de color definitivo**: escala completa con valores hex, roles
   semánticos, y **matriz de contraste AA/AAA** de cada par texto/fondo que se
   use. Debe respetar el tope de 2–3 colores principales.
3. **Escala tipográfica**: decisión sobre webfont (cuál, por qué, coste de carga,
   fallback) o defensa de la pila de sistema; tamaños, pesos, `leading` y
   `tracking` por nivel, con ejemplos aplicados a los titulares reales del sitio.
4. **Elevación, radios, bordes y espaciado**: qué distingue una superficie
   primaria de una secundaria; ritmo vertical de las secciones.
5. **Especificación por componente** de los 11 componentes y 4 páginas listados
   en §2 y §4: anatomía, estados (`default / hover / focus / active / disabled /
   loading / error / empty`), comportamiento responsive y el fragmento CSS
   propuesto.
6. **Set de iconos SVG** para los 6 productos y los iconos de interfaz que el
   rediseño introduzca. Monocromo, trazo uniforme, inline, sin dependencias.
7. **Rediseño del hero del catálogo** con las señales de confianza propias de
   banca.
8. **Rediseño del flujo del simulador**: entrada de monto/plazo, presentación del
   resultado, comparación, visualización de la amortización.
9. **Rediseño del flujo de solicitud**: progresión, resumen, confirmación y
   traspaso del estado desde el simulador.
10. **Microcopy completo**: todos los textos de interfaz reescritos —titulares,
    subtítulos, etiquetas, placeholders, textos de ayuda, mensajes de error,
    estados vacíos, toasts, footer—, en español de Colombia, tono formal de
    banca, sin jerga técnica.
11. **Checklist de accesibilidad** aplicada al resultado: contraste, foco, orden
    de tabulación, `aria-*`, tamaño mínimo de área táctil (44 × 44),
    `prefers-reduced-motion`.
12. **Plan de aplicación por fases**, indicando para cada cambio qué archivo de
    la cascada toca y si exige cambiar marcado. **Ninguna fase debe requerir
    tocar `domain/`, `application/` ni `infrastructure/`.**

---

## 8. Criterios de aceptación

- [ ] Un usuario ajeno al proyecto describe el sitio como «de un banco», no como
      «un ejercicio de clase».
- [ ] La cuenta de colores principales sigue siendo **≤ 3**, y cada color extra
      que aparezca codifica un **estado**, no decora.
- [ ] Todo valor visual nuevo existe como token en `02-tokens.css`. Cero hex
      sueltos en componentes.
- [ ] Todo par texto/fondo pasa **WCAG AA** como mínimo.
- [ ] Funciona a **375, 414, 768, 820, 1024, 1440 y 1920 px**.
- [ ] Ningún archivo de `src/domain/`, `src/application/` ni
      `src/infrastructure/` cambia.
- [ ] `node tests/01-domain-application.mjs` sigue imprimiendo `TODO OK`.
- [ ] No se introduce ningún framework CSS ni librería de componentes.
- [ ] No hay emojis en botones ni en títulos.
- [ ] Las cifras siguen siendo tabulares y alineadas a la derecha en tablas.

---

## 9. Referencias del repositorio

| Documento | Contenido |
|---|---|
| [`docs/master.md`](../master.md) | Índice de los 22 documentos del proyecto |
| [`docs/15-sistema-de-estilos.md`](../15-sistema-de-estilos.md) | Cascada de los 7 archivos CSS, convenciones de clases |
| [`docs/22-identidad-visual.md`](../22-identidad-visual.md) | Rediseño ya aplicado: qué cambió, por qué, y la regla para pantallas nuevas |
| [`docs/12-vistas-controladores-componentes.md`](../12-vistas-controladores-componentes.md) | Reglas de la capa de presentación |
| [`docs/capturas/`](../capturas/) | Capturas actuales: catálogo, simulador, búsqueda, formulario, móvil, tableta |
| [`docs/iudigital_doc/EV2/generador/img/`](../iudigital_doc/EV2/generador/img/) | Comparativa antes (`antes-*.jpg`) / después (`captura-*.jpg`) |

Para ver el sitio en marcha: `npm install && npm run dev`.
