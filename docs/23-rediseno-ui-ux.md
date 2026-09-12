[← Volver al índice maestro](./master.md)

# 23 — Rediseño UI/UX: de interfaz sobria a producto financiero

> Aplicación del *CreditSmart UI Redesign Kit* sobre el encargo recogido en
> [`docs/plans/brief-rediseno-ui-ux.md`](./plans/brief-rediseno-ui-ux.md).
> Qué se construyó, con qué reglas, y qué NO se hizo aunque el mockup lo
> mostrara.
>
> El kit (mockup aprobado, especificaciones por componente, microcopy y
> recursos) fue material de trabajo y no se versiona. Lo que sobrevive de él
> está en `public/assets/` y en este documento.
>
> Documentos relacionados:
> [15 — Sistema de estilos](./15-sistema-de-estilos.md) ·
> [22 — Identidad visual](./22-identidad-visual.md) (la corrección de paleta previa, que este rediseño da por hecha).

---

## 1. El punto de partida

El documento 22 corrigió lo que el docente señaló: se retiraron los seis
degradados de producto, el banner de tres colores y los emojis decorativos. El
resultado era **correcto pero plano**: superficies blancas, bordes de 1 px y
sombras casi invisibles. Sobriedad leída como austeridad.

Este rediseño parte de ahí y sube el listón: misma disciplina cromática, pero
con jerarquía editorial, profundidad reservada a lo interactivo, iconografía
propia, tema día/noche y tres flujos rehechos.

**Ni un archivo de `domain/`, `application/` o `infrastructure/` cambió su
comportamiento.** La única línea tocada fuera de presentación es la exposición
del puerto `IMoneyFormatter` en el proveedor de dependencias (§7).

---

## 2. Lo que se construyó, por bloques

| # | Bloque | Entregado |
|---|---|---|
| 0 | Recursos | 36 SVG de icono, 3 de logo, 5 ilustraciones, 2 fondos y 2 fotografías en `public/assets/`; `Icon.jsx`, `Logo.jsx`, `productVisualMap.js` |
| 1 | Tokens y tema | `02-tokens.css` reescrito: tres modos (claro, oscuro, automático); `03-base.css`, `04-layout.css`, `07-responsive.css` |
| 2 | Armazón | `Navbar` con 5 destinos + menú móvil, `Footer` editorial, sistema de botones, `ThemeToggle`, shell en `App.jsx` |
| 3 | Home `/` | Hero claro con señales de confianza, seis accesos de producto, banda institucional |
| 4 | Catálogo `/productos` | Ruta nueva: filtros en barra lateral + rejilla de 3 columnas |
| 5 | Simulador `/simulador` | Espacio de trabajo de 3 zonas, monto con deslizador y atajos, resultado jerárquico, barras capital/interés |
| 6 | Puente | `/solicitar?product=&amount=&term=` desde el resultado de la simulación |
| 7 | Solicitud `/solicitar` | Los 11 campos en 3 pasos + confirmación, panel de seguridad, resumen |
| 8 | Ayuda y 404 | `/ayuda` con FAQ derivadas del catálogo; 404 en español y con los tokens del sitio |
| 9 | QA | `tests/02-boot-jsdom.mjs`, matriz de 7 anchos, 3 temas, impresión |

---

## 3. Sistema visual

### 3.1 Tres colores, ahora con tema oscuro

```
Azul financiero  — identidad, acciones, navegación, jerarquía
Verde progreso   — confianza, éxito, la cuota, la seguridad
Neutros          — fondos, bordes, texto
```

Rojo y ámbar siguen siendo solo estados. La novedad es que cada rol tiene
**dos valores**, uno por tema, y ningún componente los conoce: todos consumen
alias semánticos (`--brand`, `--growth`, `--surface`, `--text-body`…).

| Rol | Claro | Oscuro |
|---|---|---|
| `--brand` | `#1455a3` | `#5ea0ff` |
| `--brand-strong` | `#0b2c4d` | `#ddebfa` |
| `--growth` | `#10743f` | `#4ed27d` |
| `--page-bg` | `#f4f8fb` | `#07131f` |
| `--surface` | `#ffffff` | `#0d1e2d` |
| `--text-strong` | `#0b2338` | `#f4f8fb` |
| `--danger` | `#c53030` | `#ff7b7b` |
| `--photo-dim` | `1` | `0.82` |

Todos los pares texto/fondo cumplen **WCAG AA** como mínimo; los principales
llegan a AAA (la matriz completa está en el kit, `docs/00-MASTER-DESIGN.md §4.3`).

### 3.2 Los tres modos de tema

1. **Claro** por defecto en `:root`.
2. **Oscuro explícito** con `:root[data-theme="dark"]`.
3. **Automático** con `@media (prefers-color-scheme: dark)`, bajo el selector
   `:root:not([data-theme="light"]):not([data-theme="dark"])` — así una
   elección explícita de tema claro no la pisa el sistema.

El tema elegido se aplica en `index.html` **antes del primer pintado**, con un
script de siete líneas que lee `localStorage`. Hacerlo desde React mostraría un
destello en claro antes de conmutar.

`ThemeToggle` solo alterna y recuerda. Sin él, el sitio sigue respondiendo al
sistema operativo con CSS puro: es una preferencia, no una dependencia.

### 3.3 Tipografía

Se mantiene la pila del sistema: cero descarga, cero CDN, cero bloqueo de
render. La sensación editorial viene de la escala, no de la fuente.

| Nivel | Tamaño | Peso |
|---|---|---|
| Hero | `clamp(2.35rem, 5vw, 4.75rem)` | 800 |
| Título de sección | `clamp(1.6rem, 2.6vw, 2.15rem)` | 700 |
| Título de tarjeta | `clamp(1.15rem, 2vw, 1.45rem)` | 700 |
| Cuota mensual | `clamp(2rem, 5vw, 3.25rem)` | 800 |
| Eyebrow | `0.75rem`, `letter-spacing: .16em` | 700 |

El tamaño de titular del hero es **para el hero**. `.section__title` fija su
propia escala aunque la etiqueta sea `h1`: la jerarquía la marca la etiqueta,
la escala la marca la clase.

### 3.4 Profundidad

Cuatro niveles y una regla: **la sombra se reserva a lo interactivo o
prioritario**. Si todo flota, nada destaca.

| Token | Uso |
|---|---|
| `--shadow-xs` | tarjetas en reposo |
| `--shadow-sm` | resultado de la simulación |
| `--shadow-md` | tarjetas al pasar el cursor, banda de confianza, avisos |
| `--shadow-lg` | ilustración del hero, toasts |
| `--shadow-focus` | anillo de foco, independiente de los anteriores |

---

## 4. Iconografía: «CreditSmart Line 24»

36 trazos propios: viewBox 24×24, `stroke-width` 1.8, remates redondos,
`currentColor`. Seis son de producto; el resto, de interfaz.

Viven dos veces a propósito:

- como archivos en `public/assets/icons/`, que es lo que documenta el kit;
- **inline** en `src/components/Icon.jsx`, que es lo que usa la aplicación.

La razón es concreta: un `<img>` es un documento aparte y **no hereda el color
del contenedor**, así que el icono no podría teñirse con el token de la
tarjeta, del botón o del panel azul. Además, inline son 36 iconos en una sola
respuesta HTTP en vez de 36.

### El mapa visual de producto

`src/config/productVisualMap.js` traduce el `id` de un producto a su
pictograma, su frase corta y el tono de su chip (`brand` o `growth`).

Es **configuración de presentación**, no dominio:

- el dominio nunca almacena una ruta de SVG ni un texto publicitario;
- `CreditProduct` y `ProductTheme` no se tocaron;
- si mañana el catálogo llega de una API, el mapa sigue valiendo porque se
  apoya en el `id`.

Único ajuste frente al kit: el sexto producto del catálogo es **Crédito de
Libranza**, no una tarjeta de crédito. Se le asignó el pictograma de documento
—la certificación laboral que el producto realmente pide— en vez de forzar el
icono de tarjeta del mockup.

---

## 5. Fotografía

Dos imágenes, las del mockup aprobado: la pareja revisando su crédito (hero) y
el paisaje de ciudad y montaña (banda de confianza).

Se sirven **locales**, no desde un CDN, y en dos formatos con `<picture>`:

| Archivo | WebP | JPG |
|---|---:|---:|
| `hero-pareja` | 83 kB | 147 kB |
| `confianza-colombia` | 235 kB | 272 kB |

Los originales pesaban 1,8 MB y 2,4 MB en PNG. Se reescalaron a 1600 px de
ancho y se recomprimieron: la primera imagen de la página no puede costar dos
megas.

La del hero se carga con `fetchPriority="high"` por ser el elemento más grande
de la primera pantalla; la de la banda, con `loading="lazy"`, porque está por
debajo del pliegue.

**Tema oscuro**: una fotografía no tiene «versión nocturna» y no se invierte.
Solo se atenúa, con el token `--photo-dim` (1 en claro, 0.82 en oscuro), que se
aplica como `filter: brightness()`. Un token en lugar de dos juegos de
imágenes.

**Texto alternativo**: la del hero describe la escena, porque aporta contexto;
la de la banda va con `alt=""` y `aria-hidden`, porque el mensaje está en el
texto que lleva encima y describir un paisaje no añadiría nada.

---

## 6. Las cinco pantallas

### 6.1 Home `/`

Hero claro —no un banner oscuro— con eyebrow, titular a dos tonos del mismo
azul, tres señales de confianza con chip de contorno verde y **una sola**
llamada a la acción en píldora, en ese orden: primero se justifica por qué
merece la pena y después se pide el clic. Una sola acción y no dos, porque el
simulador está a un clic en la barra superior y dos botones del mismo peso
repartían la atención justo donde conviene un único siguiente paso.

El hero se apoya en `--surface-brand-soft` y la franja de productos en
`--surface`: dos superficies contiguas de distinto valor dan el escalón entre
bloques sin necesidad de una línea divisoria. La banda de confianza va **a
sangre**, colgando directamente del `<main>` y sin contenedor: metida dentro de
la retícula y con esquinas redondeadas se leía como «una tarjeta más», que es
lo contrario de lo que debe hacer un cierre institucional. Su texto sí se
alinea con el contenedor del resto de la página.

**La fotografía va espejada** (`transform: scaleX(-1)`). En el original la
pareja ocupa la mitad derecha del encuadre, que es exactamente donde el diseño
coloca la tarjeta flotante: con cualquier `object-position`, la tarjeta acababa
sobre una cara. Volteada, la pareja pasa a la mitad izquierda y la tarjeta cae
sobre la ventana. No hay texto ni nada orientado en la imagen, así que el
volteo es imperceptible.

**Proporciones medidas contra el mockup, no estimadas.** La primera pasada
salió un 25 % más alta de la cuenta en todos los bloques. Comparando el panel
del mockup reescalado a 1440 px con la captura real, los valores que había que
corregir eran estos:

| | Mockup | Primera pasada | Ahora |
|---|---:|---:|---:|
| Alto del hero | ~470 px | 585 px | ~470 px |
| Titular | ~56 px | ~76 px | 56 px |
| Alto de cada acceso de producto | ~115 px | ~190 px | ~120 px |
| Banda de confianza | a sangre | dentro del contenedor | a sangre |

La lección que deja: los desajustes no estaban en el tamaño de los iconos sino
en el **aire de los bloques**. Un chip de 2.5 rem dentro de una pieza de 120 px
se lee grande; el mismo chip dentro de una de 190 px se lee diminuto. Se
corrige el contenedor, no el icono. Debajo, seis accesos de
producto y la banda institucional «Creemos en tus planes».

A partir de `56rem` la fotografía **sale del contenedor y llega hasta el borde
de la ventana**: el hero deja de ser «texto + tarjeta con foto» y pasa a ser
una sola banda, como en el diseño aprobado. El empalme entre texto e imagen es
un degradado que arranca en `--surface`, así que sigue al tema sin tocar el
marcado. Por debajo de `56rem` la foto vuelve a ser un bloque redondeado
debajo del texto.

La banda de confianza usa la misma técnica en horizontal: velo opaco sobre
todo el ancho del titular que solo se abre en el último tercio. En una columna
estrecha ese velo cubriría la banda entera, así que por debajo de `48rem` se
gira 90°: la fotografía se ve arriba y el texto se apoya sobre la parte
oscurecida.

### 6.2 Catálogo `/productos` *(ruta nueva)*

La pantalla del mockup que antes no existía. Barra lateral con cuatro
controles y rejilla de 1 → 2 → 3 columnas.

Anatomía de la tarjeta, en el orden del diseño aprobado: pictograma en chip
circular, distintivo opcional, nombre, tasa, dos datos con icono y **una sola**
acción a ancho completo con relleno suave.

El chip mide `4.75rem` con un pictograma de `2.25rem`. No es un capricho: en el
mockup el chip ocupa cerca de una cuarta parte del ancho de la tarjeta y es el
ancla visual de la pieza. A `3.5rem` —el tamaño de la primera pasada— se leía
como un adorno y la tarjeta perdía su punto de entrada.

**Quién filtra qué** es la decisión de diseño importante de esta página:

| Control | Lo resuelve | Por qué |
|---|---|---|
| Buscar producto | **Dominio** (`ProductSearchCriteria`) | Es un criterio de negocio: la misma consulta la haría un backend |
| Monto deseado | **Dominio** (`AmountRange.overlaps()`) | Ídem |
| Tipo de crédito | **Presentación** (`useCatalogRefinement`) | Elegir qué tarjetas mirar es lo mismo que ordenarlas |
| Plazo | **Presentación** (`useCatalogRefinement`) | Ídem |
| Ordenar por | **Presentación** (`useProductSorting`) | El orden nunca fue una regla de negocio |

Ninguna de las listas de opciones está escrita a mano: las cuatro se derivan
del catálogo, así que añadir un producto las actualiza solas.

### 6.3 Simulador `/simulador`

Tres zonas en el orden en que se decide: **ajusto** a la izquierda (panel azul),
**veo la cifra** en el centro, **me convenzo** a la derecha.

- El monto se edita con `input[type=number]` **y** deslizador **y** atajos de
  porcentaje, los tres sobre el mismo estado. El deslizador no sustituye al
  campo ni a la validación: sus límites salen del producto y el dominio vuelve
  a comprobarlos igualmente.
- El paso del deslizador se deriva del rango (`(max − min) / 100`, mínimo
  100 000): un paso fijo dejaría el máximo fuera de alcance en unos productos y
  daría saltos absurdos en otros.
- **No hay botón «Calcular»**: la cuota se sigue recalculando en cada cambio.
- La tabla de amortización añade una barra de reparto capital/interés por fila.
  Es un **complemento**: los números siguen en sus columnas, que es lo que se
  lee con un lector de pantalla y lo que se imprime.
- El segundo catálogo no desaparece, cambia de propósito: **«Explora
  alternativas — compara otras opciones sin perder tu simulación actual»**, que
  es literalmente lo que hace.

### 6.4 Solicitud `/solicitar`

Los **mismos 11 campos** y las **mismas reglas**, repartidos en tres pasos más
una confirmación. Lo único que cambia es cuántos campos se ven a la vez: el
objeto que llega a `SubmitCreditApplicationUseCase` es idéntico y el envío
sigue ocurriendo una sola vez, al final.

- El indicador de pasos es un **indicador**, no una navegación: no se puede
  saltar a un paso no completado, así que los hitos no son botones.
- Avanzar revela los errores del paso actual; si los hay, no se pasa.
- El radicado queda en un **bloque persistente**, no solo en un aviso que se va
  a los seis segundos.

### 6.5 Ayuda `/ayuda` *(ruta nueva)* y 404

`/ayuda` usa `<details>`/`<summary>` nativos —teclado, lector de pantalla y
búsqueda dentro de la página ya resueltos por el navegador— y **todas sus
respuestas salen de algo que la aplicación hace o de un dato del catálogo**:
los requisitos por producto se leen del propio `CreditProductDTO`.

El 404 conserva barra y pie, está en español y usa los tokens del sitio. Una
página de error que parece de otra aplicación hace dudar de que se siga en la
misma.

---

## 7. El puente simulador → solicitud

```
/solicitar?product=<id>&amount=<number>&term=<months>
```

Se eligió cadena de consulta y no estado del router para que el enlace
sobreviva a un refresco y se pueda compartir.

Regla que lo hace seguro: **venir de la URL no da ningún privilegio**. Los tres
valores entran en `useApplicationForm` como cualquier otro y pasan por la misma
validación del dominio, así que un enlace manipulado a mano se rechaza igual
que un valor tecleado. Si el `id` no existe en el catálogo, no se prellena
nada.

Si el plazo traspasado no está en la lista corta del formulario, **se añade a
las opciones** en vez de descartarse en silencio: perder la decisión que el
usuario acaba de tomar sería peor que ofrecer un plazo más.

### El único cambio fuera de presentación

`DependenciesProvider` ahora expone también el puerto `IMoneyFormatter`:

```js
moneyFormatter: container.resolve('moneyFormatter'),
```

Lo necesita el resumen de la solicitud, que muestra un monto recién tecleado
para el que todavía no existe ningún DTO. La alternativa —formatear pesos a
mano en la vista— duplicaría la moneda y el locale fuera de `AppConfig`.

Es el **puerto**, no el adaptador: la vista sigue sin conocer `Intl`, y la
regla «la presentación no importa infraestructura» se mantiene intacta.

---

## 8. Accesibilidad

Todo lo que había se conserva, y se añade:

| Añadido | Dónde |
|---|---|
| Enlace «Saltar al contenido» | `App.jsx`, visible solo al tabular |
| `aria-current="page"` | Navegación (lo pone `NavLink`, no una clase paralela) |
| `aria-current="step"` | Paso actual de la solicitud |
| `aria-valuetext` | Deslizadores de monto: anuncian «Hasta $5.000.000», no «2» |
| `aria-busy` | Botón de envío mientras se radica |
| `aria-expanded` / `aria-controls` | Menú móvil y tabla plegable |
| Área táctil ≥ 44×44 | `--touch-target: 2.75rem` en botones, enlaces de nav y casillas |
| `prefers-reduced-motion` | Reduce toda transición y animación, en cualquier tema |

El color nunca va solo: cada estado lleva icono y texto además del tono. Un
mensaje que solo se distingue por el rojo no llega a quien no distingue el
rojo.

---

## 9. Responsive

Mobile-first. Breakpoints de layout `40rem` (640) y `64rem` (1024), más ajustes
de contenedor en `90rem` y `120rem`.

| Ancho | Comportamiento |
|---|---|
| 375 / 414 | 1 columna; navegación plegada en menú; tarjeta flotante del hero oculta; el indicador de pasos conserva los puntos y oculta las etiquetas; acciones del hero a ancho completo |
| 768 / 820 | 2 columnas de tarjetas; filtros sobre la rejilla; formulario a 2 columnas |
| 1024 | 3 columnas; filtros como barra lateral adherida; simulador en sus 3 zonas |
| 1440 / 1920 | Más aire, no más tipografía: `--container-xl` pasa a 82rem y el gutter a 2.5rem |

Verificado sin desbordamiento horizontal (`scrollWidth === clientWidth`) en los
siete anchos.

---

## 10. Impresión

Una simulación impresa se trata como un documento financiero, no como una
captura de la web: se ocultan navegación, pie, avisos, filtros y botones; se
fuerzan fondo blanco y texto negro redefiniendo los tokens dentro de
`@media print`; la tabla de amortización se expande entera (`max-height: none`)
y se marca `break-inside: avoid` en resultado, resumen y tarjetas.

---

## 11. Lo que el mockup mostraba y NO se hizo

Esta es la parte que conviene poder defender.

| Elemento del mockup | Decisión | Motivo |
|---|---|---|
| «+50.000 personas han confiado en nosotros» | **No se pinta** | No existe ninguna fuente. Se sustituye por métricas comprobables: 6 productos · 100% digital · simulación inmediata |
| «4,8/5 satisfacción de nuestros clientes» | **No se pinta** | Ídem |
| «Respuesta en minutos» | **No se pinta** | Es un compromiso de servicio (SLA) que el proyecto no presta. Se sustituye por «Simulación inmediata» |
| Badge «Más solicitado» | **Se cambia el texto** | La forma, el color y la posición del distintivo son los del mockup; lo que cambia es la afirmación. «Más solicitado» es una estadística de demanda que nadie mide en este proyecto, así que el distintivo pasa a decir **«Menor tasa»** y se calcula sobre el catálogo real: marca el producto con la tasa más baja, que además es lo que el usuario está comparando |
| «Encriptación SSL», «Ley 1581 de 2012» | **No se pinta** | Declarar una tecnología o una norma concreta sin tenerlo documentado destruye la credibilidad en cuanto alguien lo comprueba |
| Campos «Tipo de documento», «Nombres», «Apellidos» | **No se añaden** | Cambiarían el objeto que valida el dominio. Se conservan los 11 campos reales |
| Descripción y requisitos en la tarjeta | **Se mueven, no se pierden** | El mockup no los muestra: alargaban la tarjeta hasta romper la rejilla y convertían una pieza de comparación en un bloque de lectura. Siguen en la aplicación, dentro de las preguntas frecuentes de `/ayuda` |
| Barra de pestañas inferior en móvil | **No se añade** | Duplica la navegación y come alto de pantalla; el kit especifica menú desplegable simple |
| Enlace «Ayuda» sin destino | **Se le dio destino real** | Un enlace muerto es peor UX que no tenerlo: se construyó `/ayuda` con contenido derivado del catálogo |

El propio kit lo pide en `docs/01-MAPA-FUNCIONALIDADES-UI.md §4`: no inventar
funcionalidad. En una web financiera, una cifra inventada es exactamente la
señal que el docente marcó como pérdida de credibilidad.

---

## 12. Tres fallos que solo aparecieron en el navegador

Las capturas automatizadas a 1440 px daban por buenas cosas que no lo eran.
Recorrer la aplicación a mano, en una ventana de 1912 px, destapó tres:

### 12.1 La fotografía del hero no llegaba al borde

`.hero__inner` tenía `position: relative`, así que el `right: 0` de la
fotografía se anclaba **al contenedor** y no a la ventana: a 1912 px terminaba
en 1716 y dejaba una franja de 181 px vacía contra el borde derecho. A 1440 px
el contenedor casi coincide con la ventana y el hueco era imperceptible.

Corrección: el contexto de posicionado lo pone `.hero`, que ocupa todo el
ancho. El `z-index` que necesitaba el contenedor se trasladó a `.hero__copy`.

### 12.2 El texto de la banda no seguía la retícula

Su sangría se calculaba contra `--container-xl`, pero la home usa
`container--wide`, que es `--container-2xl`. Y el `100%` del `calc()` se
resolvía contra la columna de la fotografía, no contra la banda. Resultado: el
titular caía en x=300 mientras el resto de la página empezaba en x=181.

Corrección: el texto cuelga de la banda —no de la columna de la imagen— y usa
la misma fórmula que `.container--wide`.

### 12.3 El formulario se autoenviaba al llegar al último paso

El más serio de los tres. Al pulsar «Continuar» en el paso 2, el paso 3 se
abría con los tres campos en rojo y un aviso de error que el usuario no había
provocado.

Causa: React reutiliza el mismo nodo `<button>` entre renders. Al cambiar
`currentStep`, ese nodo pasaba de «Continuar» (`type="button"`) a «Enviar
solicitud» (`type="submit"`) **dentro del propio clic**, antes de que el
navegador ejecutara la acción por defecto. Cuando el navegador llegaba a
ejecutarla, el botón ya era de envío, así que ese mismo clic enviaba el
formulario.

Corrección: cada botón lleva su `key`, ninguno es `type="submit"` y el envío se
dispara desde `onClick`. Deja de depender de qué nodo decida reutilizar React.

**Lo que enseña:** un formulario por pasos no se valida con capturas. Hay que
pulsarlo.

---

## 13. Verificación

```bash
node tests/01-domain-application.mjs   # dominio y aplicación intactos
npm run build                          # el paquete compila
npm install jsdom --no-save
node tests/02-boot-jsdom.mjs           # las 6 rutas montan y pintan
```

Las dos suites imprimen `TODO OK`.

`02-boot-jsdom.mjs` es nuevo. Monta la aplicación real —el mismo `App.jsx`, el
mismo contenedor— en un DOM simulado y comprueba tres cosas que se pueden
romper sin darse cuenta al mover marcado de sitio:

1. que el grafo de dependencias se resuelve entero (`eagerResolveAll()`, así un
   contrato roto falla al arrancar y no a mitad de una navegación);
2. que cada una de las seis rutas pinta su contenido sin lanzar;
3. que no queda ningún emoji de interfaz en el marcado.

Comprobaciones de arquitectura, las tres deben devolver **cero líneas**:

```bash
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)" src/application/
grep -rn "infrastructure" src/components/ src/pages/ src/hooks/
```

Y la regla del sistema de estilos:

```bash
# Ningún hex fuera del archivo de tokens
grep -rn "#[0-9a-fA-F]\{3,8\}" assets/css/ --include=*.css | grep -v 02-tokens.css
```

---

## 14. Inventario de archivos

### Nuevos

```
public/assets/                         57 recursos (iconos, logos, ilustraciones, fondos, fotos)
src/components/Icon.jsx                set «CreditSmart Line 24» inline
src/components/Logo.jsx                marca con colores por token
src/components/ThemeToggle.jsx         conmutador día/noche
src/components/Breadcrumb.jsx          migas de pan
src/components/ProductTile.jsx         acceso rápido de la home
src/components/CatalogFilters.jsx      barra lateral de filtros
src/components/GoalPanel.jsx           panel de acompañamiento del simulador
src/components/ApplicationStepper.jsx  indicador de pasos
src/components/ApplicationSummary.jsx  resumen del crédito solicitado
src/components/SecurityPanel.jsx       panel de protección de datos
src/config/productVisualMap.js         pictograma y frase corta por producto
src/hooks/useCatalogRefinement.js      filtros de tipo y plazo (presentación)
src/pages/HomePage.jsx                 sustituye a CatalogPage
src/pages/ProductsPage.jsx             ruta nueva
src/pages/HelpPage.jsx                 ruta nueva
tests/02-boot-jsdom.mjs                prueba de arranque de la interfaz
docs/23-rediseno-ui-ux.md              este documento
```

### Reescritos

```
assets/css/02-tokens.css · 03-base.css · 04-layout.css
assets/css/05-components.css · 06-pages.css · 07-responsive.css
index.html · manifest.json
src/App.jsx · src/config/routes.js
src/components/Navbar.jsx · Footer.jsx · CreditCard.jsx · Alert.jsx
src/components/SearchBar.jsx · AmountRangeFilter.jsx · SortSelect.jsx
src/components/SimulatorForm.jsx · SimulationResult.jsx · AmortizationTable.jsx · FormField.jsx
src/pages/SimulatorPage.jsx · ApplicationPage.jsx · NotFoundPage.jsx
src/hooks/useApplicationForm.js
```

### Retirados

```
src/pages/CatalogPage.jsx   → HomePage.jsx + ProductsPage.jsx
```

### Tocado fuera de presentación

```
src/context/DependenciesProvider.jsx   una línea: expone el puerto IMoneyFormatter
assets/css/01-reset.css                dos referencias a tokens renombrados
```
