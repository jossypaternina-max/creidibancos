[← Volver al índice maestro](./master.md)

# 15 — Sistema de estilos

> Los 7 archivos CSS en cascada, los design tokens, el tema claro/oscuro, las
> convenciones de nombres y las reglas que no se negocian.
>
> Este documento describe el sistema **vigente**, el que dejó el rediseño de la
> Actividad 2. El porqué de cada decisión visual está en
> [23 — Rediseño UI/UX](./23-rediseno-ui-ux.md); la corrección de paleta que lo
> precedió, en [22 — Identidad visual](./22-identidad-visual.md).

---

## 15.1 CSS plano, escrito a mano

Sin Tailwind, sin Sass, sin CSS-in-JS y sin librería de componentes. Tampoco hay
webfont: la tipografía es la pila del sistema.

No es una limitación que se sufre, es la restricción del proyecto y tiene
consecuencias favorables:

- cero descargas adicionales y cero bloqueo de render;
- ninguna dependencia de CDN que pueda caerse o cambiar;
- el CSS se lee entero en una tarde, y cada regla tiene un motivo escrito al
  lado.

La sensación editorial se consigue con **escala, peso, tracking y espacio**, no
con una fuente externa.

---

## 15.2 La cascada explícita

Siete archivos, importados en orden desde `src/main.jsx`. El orden es el
sistema: quien llega después puede corregir a quien llegó antes, y por eso
nunca hace falta un `!important` para ganar una especificidad.

| # | Archivo | Contiene |
|---|---|---|
| 01 | `01-reset.css` | Normalización mínima, tipo preflight |
| 02 | `02-tokens.css` | **Única fuente de verdad visual**: color, tipografía, espacio, sombras, motion, y los tres modos de tema |
| 03 | `03-base.css` | Elementos base, escala de titulares, foco, marca, utilidades |
| 04 | `04-layout.css` | Página, contenedores, secciones, migas, rejillas |
| 05 | `05-components.css` | Lo que se repite: navbar, botones, tarjetas, campos, avisos, toasts, pie |
| 06 | `06-pages.css` | Lo que aparece una sola vez: hero, banda de confianza, simulador, pasos, 404 |
| 07 | `07-responsive.css` | Utilidades por viewport, pantallas grandes e impresión |

Regla para decidir dónde va algo nuevo: **si se usa dos veces, es 05; si se usa
una, es 06**. Los breakpoints de un componente viven junto al componente; en 07
solo quedan las utilidades transversales y la hoja de impresión.

---

## 15.3 `02-tokens.css` — la única fuente de verdad

La regla es literal y comprobable: **ningún otro archivo de la cascada declara
un `#hex`, un `rgb()` o un `hsl()`**.

```bash
grep -rn "#[0-9a-fA-F]\{3,8\}" assets/css/ --include=*.css | grep -v 02-tokens.css
```

Debe devolver cero líneas.

### Tres colores, y dos de ellos casi no son color

```
Azul financiero  — identidad, acciones, navegación, jerarquía
Verde progreso   — confianza, éxito, la cuota, la seguridad
Neutros          — fondos, bordes, texto. No compiten.
```

Rojo y ámbar existen, pero **solo como estados semánticos**. Si un color no
distingue un estado ni marca la acción principal, no entra.

### Aliases semánticos

Los componentes **nunca** consumen la escala cruda (`--blue-700`); consumen el
alias (`--brand`). Ese nivel de indirección es lo que hace posible el tema
oscuro sin tocar un solo componente.

| Alias | Claro | Oscuro |
|---|---|---|
| `--page-bg` | `#f4f8fb` | `#07131f` |
| `--surface` | `#ffffff` | `#0d1e2d` |
| `--surface-soft` | `#edf4f7` | `#13293a` |
| `--surface-border` | `#d7e2ea` | `#284154` |
| `--text-strong` | `#0b2338` | `#f4f8fb` |
| `--text-body` | `#233746` | `#d7e2ea` |
| `--text-muted` | `#536779` | `#a9bac7` |
| `--brand` | `#1455a3` | `#5ea0ff` |
| `--brand-strong` | `#0b2c4d` | `#ddebfa` |
| `--growth` | `#10743f` | `#4ed27d` |
| `--danger` | `#c53030` | `#ff7b7b` |
| `--chip-brand-bg` | `#ddebfa` | `#12385c` |
| `--chip-growth-bg` | `#dff4e7` | `#123c29` |
| `--logo-stroke` | `#ffffff` | `#07131f` |
| `--photo-dim` | `1` | `0.82` |

Los dos últimos merecen una nota, porque resuelven un problema recurrente sin
duplicar archivos:

- **`--logo-stroke`**: el trazo que cruza el símbolo de la marca. Un token en
  lugar de dos SVG distintos.
- **`--photo-dim`**: una fotografía no tiene «versión nocturna» y no se
  invierte; solo se atenúa. Se aplica como `filter: brightness(var(--photo-dim))`.

### Tipografía

Escala fija en tokens (`--text-xs` … `--text-6xl`), pesos 400–800, y tres
niveles de tracking. Los titulares usan `clamp()`, así que responden al viewport
sin un breakpoint por nivel:

| Nivel | Tamaño | Peso |
|---|---|---|
| Hero | `clamp(2.25rem, 3.9vw, 3.5rem)` | 800 |
| Título de sección | `clamp(1.6rem, 2.6vw, 2.15rem)` | 700 |
| Título de tarjeta | `clamp(1.15rem, 2vw, 1.45rem)` | 700 |
| Cuota mensual | `clamp(2rem, 5vw, 3.25rem)` | 800 |
| Eyebrow | `0.75rem`, `letter-spacing: .16em` | 700 |

Detalle que importa: **el tamaño de titular del hero es para el hero**.
`.section__title` fija su propia escala aunque la etiqueta sea `h1`. La
jerarquía la marca la etiqueta; la escala, la clase.

### Elevación

Cuatro niveles y una regla: **la sombra se reserva a lo interactivo o
prioritario**. Si todo flota, nada destaca.

| Token | Uso |
|---|---|
| `--shadow-xs` | tarjetas en reposo |
| `--shadow-sm` | resultado de la simulación |
| `--shadow-md` | tarjetas al pasar el cursor, banda de confianza |
| `--shadow-lg` | toasts |
| `--shadow-focus` | anillo de foco, independiente de los anteriores |

### Radios, contenedores, motion

Radios de `0.375rem` a `1.25rem` más `--radius-pill`. Contenedores de `40rem` a
`96rem`, con `--content-gutter` como `clamp()`. Motion en tres duraciones
(140/220/360 ms) y dos curvas.

---

## 15.4 Los tres modos de tema

1. **Claro** por defecto, en `:root`.
2. **Oscuro explícito** con `:root[data-theme="dark"]`.
3. **Automático** con `@media (prefers-color-scheme: dark)`, bajo el selector
   `:root:not([data-theme="light"]):not([data-theme="dark"])`.

Ese selector del tercer caso es el que hace que **una elección explícita de tema
claro no la pise el sistema**. Sin él, quien tenga el sistema en oscuro no
podría quedarse en claro.

El tema elegido se aplica en `index.html` **antes del primer pintado**, con un
script de siete líneas que lee `localStorage`:

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem('creditsmart-theme');
      if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch (error) { /* modo privado: se queda en automático */ }
  })();
</script>
```

Hacerlo desde React mostraría un destello en claro antes de conmutar.

`ThemeToggle` solo alterna y recuerda. Sin él, el sitio sigue respondiendo al
sistema operativo con CSS puro: es una preferencia, no una dependencia.

> **Nota para la sustentación.** El sitio respeta el tema del sistema. Si el
> equipo donde se presenta tiene Windows en modo oscuro, la aplicación abrirá
> en oscuro y no con el aspecto del mockup. Es el comportamiento correcto y
> deliberado; el botón de la barra lo pasa a claro en un clic.

---

## 15.5 Temas de producto

`CreditProduct` tiene un value object `ProductTheme` con seis paletas válidas,
porque el tema es un atributo del producto. **Cómo se pinta** ese atributo es
otra cosa, y se decide en presentación:

- el color se resuelve al azul corporativo para los seis (ver
  [22 §4](./22-identidad-visual.md));
- el pictograma y la frase corta los da `src/config/productVisualMap.js`.

Consecuencia: el dominio **nunca** almacena una ruta de SVG ni un texto
publicitario, y si el catálogo pasa a venir de una API, el mapa sigue valiendo
porque se apoya en el `id`.

---

## 15.6 Convención de nombres

BEM relajado: `bloque__elemento--modificador`.

```css
.product-card { }
.product-card__icon { }
.product-card__icon--growth { }
.product-card--compact { }
```

Tres reglas:

1. **El estado se lee del atributo, no de una clase paralela.** La ruta activa
   es `[aria-current="page"]`, el modo de tabla seleccionado es
   `[aria-pressed="true"]`, el campo inválido es `[aria-invalid="true"]`. Una
   clase `.is-active` que hay que mantener sincronizada con el `aria-` acaba
   desincronizándose; el atributo es a la vez la semántica y el gancho del CSS.
2. **Nada de utilidades genéricas.** Hay unas pocas (`.t-muted`, `.sr-only`,
   `.numeric`, `.container--*`), y ahí se acaba. Sin `.mt-4` ni `.flex-1`.
3. **Un componente, un bloque.** Si un bloque necesita dos nombres, son dos
   componentes.

---

## 15.7 Responsive

Mobile-first. Breakpoints de layout en `40rem` (640) y `64rem` (1024), más
ajustes de contenedor en `90rem` y `120rem`.

| Ancho | Comportamiento |
|---|---|
| 375 / 414 | 1 columna; navegación plegada en menú; tarjeta flotante del hero oculta; el indicador de pasos conserva los puntos y oculta las etiquetas |
| 768 / 820 | 2 columnas de tarjetas; filtros sobre la rejilla; formulario a 2 columnas |
| 1024 | 3 columnas; filtros como barra lateral adherida; simulador en sus 3 zonas |
| 1440 / 1920 | Más aire, no más tipografía: `--container-xl` pasa a 82rem y el gutter a 2.5rem |

### Dos piezas que se salen del contenedor

Ambas son deliberadas y ambas dieron problemas hasta encontrar la forma
correcta:

**La fotografía del hero** ocupa el borde derecho de la ventana a partir de
`56rem`. Para eso el contexto de posicionado debe ser `.hero`, que ocupa todo el
ancho, y **no** `.hero__inner`, que es el contenedor: si el contenedor crea
contexto, el `right: 0` se ancla a él y queda una franja vacía contra el borde.

**La banda de confianza** va a sangre colgando directamente del `<main>`, sin
contenedor. Su texto, en cambio, sí se alinea con la retícula del resto de la
página, con la misma fórmula que `.container--wide`:

```css
padding-inline-start: max(
  var(--content-gutter),
  calc((100% - var(--container-2xl)) / 2)
);
```

El `100%` de ese `calc()` se resuelve contra el **bloque contenedor del
elemento**. Por eso el texto cuelga de la banda y no de la columna de la
fotografía: colgado de la columna, el cálculo daba negativo y el titular se iba
al borde.

---

## 15.8 Accesibilidad en CSS

### Foco visible

El anillo por defecto se retira **solo junto con su reemplazo**:

```css
:focus { outline: none; }

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  box-shadow: var(--shadow-focus);
}
```

`:focus-visible` y no `:focus`: el anillo aparece al tabular y no al hacer clic.

### Movimiento reducido

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Vale para cualquier tema. Es uno de los dos únicos sitios con `!important` de
todo el sistema, y está justificado: anula declaraciones de terceros y de
cualquier componente.

### Espacio reservado para el error

```css
.field__error { min-height: 1.2em; }
```

El mensaje aparece y desaparece sin empujar el resto del formulario.

### El color nunca va solo

Cada estado lleva icono y texto además del tono. Un mensaje que solo se
distingue por el rojo no llega a quien no distingue el rojo.

### Área táctil

`--touch-target: 2.75rem` (44 px) como mínimo en botones, enlaces de navegación,
casillas y controles de pestaña.

### `sr-only` y salto al contenido

`.sr-only` oculta visualmente sin sacar del árbol de accesibilidad.
`.skip-link` vive fuera de la pantalla y entra al recibir el foco.

---

## 15.9 Impresión

Una simulación impresa es un documento financiero, no una captura de la web. En
`@media print` se **redefinen los tokens** —no se reescribe cada regla—, lo que
deja el sistema entero en blanco y negro de una sola pasada:

```css
@media print {
  :root {
    --page-bg: var(--print-bg);
    --surface: var(--print-bg);
    --text-body: var(--print-text);
    --brand: var(--print-text);
    /* … */
  }
}
```

Además: se ocultan navegación, pie, avisos, filtros y botones; la tabla de
amortización se expande entera (`max-height: none`); y resultado, resumen y
tarjetas llevan `break-inside: avoid`.

---

## 15.10 Reglas del sistema de estilos

1. Ningún `#hex` fuera de `02-tokens.css`.
2. Ningún componente consume la escala cruda: solo aliases semánticos.
3. Tres colores principales. Un color extra debe codificar un **estado**.
4. Cada archivo de la cascada tiene su cometido; nada se mete en el de otro.
5. El estado se lee del atributo `aria-`, no de una clase paralela.
6. `:focus-visible` nunca se retira sin reemplazo.
7. Cifras siempre tabulares (`font-variant-numeric`).
8. Área táctil mínima de 44 × 44.
9. Sin emojis en botones ni en títulos.
10. Todo par texto/fondo cumple WCAG AA como mínimo, en los dos temas.

---

## 15.11 Siguiente lectura

- [23 — Rediseño UI/UX](./23-rediseno-ui-ux.md): el porqué de cada decisión
  visual, las cinco pantallas y los fallos que solo aparecen en el navegador.
- [22 — Identidad visual](./22-identidad-visual.md): la corrección de paleta que
  precedió al rediseño.
- [12 — Vistas, controladores y componentes](./12-vistas-controladores-componentes.md):
  cómo se consume este sistema desde la capa de presentación.
