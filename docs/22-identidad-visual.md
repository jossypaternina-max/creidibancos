[← Volver al índice maestro](./master.md)

# 22 — Identidad visual: sobriedad para un producto financiero

> **Primera corrección visual de la Actividad 2.** Qué se cambió, por qué, y la
> regla que debe seguir cualquier pantalla nueva.
>
> ⚠️ **Este documento describe un estado intermedio.** La paleta y el criterio
> de «tres colores» que fija aquí siguen vigentes y son la base de todo lo que
> vino después, pero los valores concretos de color, la iconografía y la
> composición de las pantallas los reemplazó el rediseño completo:
> [23 — Rediseño UI/UX](./23-rediseno-ui-ux.md).
>
> Se conserva porque explica **por qué** se retiraron los seis degradados de
> producto, que es la decisión que originó todo lo demás.
>
> Documento técnico complementario: [15 — Sistema de estilos](./15-sistema-de-estilos.md).

---

## 1. El problema

La primera versión heredó del sitio de referencia una decisión visual que no
resiste el criterio de un producto financiero real:

| Elemento | Qué hacía | Por qué estorba |
|---|---|---|
| Banner | Degradado azul + titular con la segunda línea en **verde** + botón **verde** | Tres familias de color (blanco, verde, azul) compitiendo en la zona de mayor atención de la página |
| Tarjetas de producto | Cabecera con un **degradado distinto por producto**: azul, verde, violeta, ámbar, rosa y turquesa | Seis degradados en la misma rejilla saturan la pantalla; el color no aporta información y cansa |
| Resultado de la simulación | Tomaba el degradado del producto simulado | El panel cambiaba de color en cada simulación: inestabilidad visual sin significado |
| Avisos informativos | Amarillo con borde ámbar | Un cuarto color en pantalla para un mensaje que solo informa |
| Secciones del formulario | Iconos en azul, verde y violeta | Son tres partes del mismo trámite, no tres cosas distintas |
| Botones y títulos | Emojis decorativos (🧮 ✅ 🗑️ 💰 ℹ️) | Restan formalidad; en banca el tono importa |

El efecto conjunto es el que señaló la revisión del docente: saturación visual
que, en un entorno real, **haría dudar al usuario sobre la legitimidad del
sitio**. En banca, la credibilidad es parte del producto.

---

## 2. La regla nueva: tres colores, y dos de ellos casi no son color

```
1. Azul corporativo   — identidad, acciones, jerarquía        (una sola familia)
2. Gris neutro        — texto, bordes, superficies            (no compite)
3. Verde desaturado   — SOLO confirmación de una operación    (nunca decora)
```

Corolarios, en orden de importancia:

1. **El color no es decoración: es información.** Si un color no distingue un
   estado (éxito, error, aviso) ni marca la acción principal, no entra.
2. **Una familia, varios tonos.** La jerarquía se construye con tonos del mismo
   azul, no añadiendo hues. Dos tonos de azul siguen siendo un color.
3. **La superficie es blanca.** Las tarjetas y los paneles se separan del fondo
   con un borde de 1 px y una sombra mínima, no con relleno de color.
4. **Lo que destaca, destaca por contraste y tamaño.** La cuota mensual es el
   dato que el usuario vino a buscar: es la única tarjeta blanca sobre el panel
   azul. No hace falta un color nuevo para eso.
5. **Sin emojis decorativos.** Se conserva el pictograma del producto, porque es
   un dato del catálogo, pero desaturado para que se integre en la paleta.

---

## 3. La paleta

Escala azul corporativa (reemplaza al azul royal saturado de la primera
versión), en `assets/css/02-tokens.css`:

| Token | Valor | Uso |
|---|---|---|
| `--color-blue-50` | `#f4f7fb` | Fondo de avisos, chips y estado activo de navegación |
| `--color-blue-100` | `#e5ecf5` | Bordes suaves, halo de foco |
| `--color-blue-200` | `#c7d6e8` | Texto secundario sobre fondo oscuro, bordes de aviso |
| `--color-blue-500` | `#45648f` | Segundo tono de la marca, foco de los controles |
| `--color-blue-700` | `#1f3a5f` | **Color de marca**: botones, enlaces, cifras |
| `--color-blue-800` | `#182e4c` | Hover de botones, fondo del banner |
| `--color-blue-900` | `#101f35` | Pie de página, base del degradado del banner |

Verde de estado, desaturado a propósito: `--success: #1f6654`. Se usa en un
único sitio, el borde del aviso de éxito. El rojo (`#dc2626`) queda reservado a
los errores de validación.

Los tokens de violeta, ámbar, rosa y turquesa se conservan en el archivo, pero
**ya no pintan ninguna superficie de la aplicación**: quedan como referencia del
catálogo original.

---

## 4. Los seis temas de producto, resueltos al mismo azul

Este es el punto que conecta el rediseño con la arquitectura.

`CreditProduct` tiene un value object `ProductTheme` con seis paletas válidas
(`blue`, `emerald`, `violet`, `amber`, `rose`, `teal`), porque **el tema es un
atributo del producto**: así viene del catálogo y así se valida en el dominio.

Cómo se pinta ese atributo, en cambio, es una decisión de presentación. Y la
decisión es: los seis se resuelven al azul corporativo.

```css
/* assets/css/02-tokens.css */
.theme-blue,
.theme-emerald,
.theme-violet,
.theme-amber,
.theme-rose,
.theme-teal {
  --product-chip-bg: var(--color-blue-50);
  --product-chip-border: var(--color-blue-100);
  --product-accent: var(--color-blue-700);
  --product-badge-bg: var(--color-blue-50);
  --product-badge-fg: var(--color-blue-700);
  --product-badge-border: var(--color-blue-100);
}
```

Consecuencias:

- El rediseño **no tocó el dominio, ni un caso de uso, ni un componente**: son
  seis selectores en el archivo de tokens.
- Si mañana el negocio quiere volver a distinguir productos por color —o
  distinguir solo dos familias, o marcar el producto en promoción—, el cambio
  vuelve a ser ese mismo bloque.
- Los productos siguen siendo distinguibles: por su nombre, su pictograma, su
  tasa y su rango de montos. El color no estaba aportando nada que no dijera ya
  el texto.

Es el mismo argumento de la migración a React, aplicado a la capa visual: la
decisión está aislada en el sitio donde corresponde tomarla.

---

## 5. Cambios concretos, elemento por elemento

| Elemento | Antes | Ahora |
|---|---|---|
| Banner | Degradado diagonal azul + acento verde + botón verde | Un azul en dos tonos verticales; titular en blanco y azul claro; botón **blanco** (el único elemento claro, donde debe ir la atención) |
| Marca «CreditSmart» | «Credit» azul + «Smart» verde | Dos tonos del mismo azul; peso reducido de 900 a 700 |
| Tarjeta de producto | Cabecera con degradado, nombre en blanco, emoji suelto de 36 px | Superficie blanca, línea superior azul de 3 px, nombre en gris oscuro, pictograma en chip neutro de 44 px |
| Badge de monto | Relleno del color del producto | Azul claro con borde de 1 px y cifras tabulares |
| Panel de resultado | Degradado del producto simulado | Azul corporativo fijo; la cuota mensual en tarjeta blanca |
| Aviso informativo | Amarillo | Azul claro |
| Secciones del formulario | Iconos azul, verde y violeta | Color de marca compartido y filete azul claro a la izquierda |
| Tipografía de titulares | Peso 900 | Peso 700 con `letter-spacing` negativo |
| Radios | 16 px | 10 px (`--radius-2xl`), más corporativo |
| Sombras | Grises genéricas | Teñidas con el azul de marca y de menor opacidad |
| Emojis de interfaz | En botones, títulos y avisos | Retirados; el pictograma del producto queda desaturado |
| Cifras | Fuente proporcional | `font-variant-numeric: tabular-nums` en tasas, montos y tablas |

---

## 6. Qué comprobar antes de dar por buena una pantalla nueva

1. **Cuenta los hues.** Si aparece un color que no sea azul, gris, verde de
   éxito o rojo de error, sobra o hay que justificarlo como estado.
2. **Pregunta qué informa el color.** Si la respuesta es «se ve bonito», fuera.
3. **Revisa el contraste del texto**, no el del relleno: cuerpo sobre blanco en
   `--text-body` o más oscuro; sobre azul oscuro, blanco o `--color-blue-200`.
4. **Un solo elemento dominante por bloque.** En el panel de resultado es la
   cuota; en el banner, el botón; en la tarjeta, el nombre del producto.
5. **Sin emojis en botones ni títulos.**
6. **Cifras siempre tabulares**, para que las columnas de números se alineen.
7. **Comprueba móvil (414 px) y tableta (820 px)** antes de cerrar el cambio:
   las capturas de referencia están en [`docs/capturas/`](./capturas/).

---

## 7. Lo que esto no cambió

Ni un archivo de `domain/`, `application/` o `infrastructure/`. Ni un caso de
uso. Ni un hook. El rediseño completo son cinco archivos CSS y la retirada de
los emojis decorativos del marcado de siete componentes y páginas.

`node tests/01-domain-application.mjs` sigue dando `TODO OK`, porque el color
nunca fue una regla de negocio.
