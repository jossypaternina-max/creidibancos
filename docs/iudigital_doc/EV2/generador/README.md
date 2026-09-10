# Generador del documento de la Actividad 2 (.docx)

Scripts que producen **`../CreditSmart_Arquitectura_EV2_generado.docx`**: el
documento técnico de la Actividad 2 de CreditSmart (43 páginas, 21 secciones,
9 imágenes, 60 tablas).

El documento no se escribe a mano: se genera desde estos scripts para que los
datos que cita —conteos de archivos por capa, tasas y plazos de los productos,
cifras de la simulación, número de contratos y de dependencias, resultado de las
pruebas, lista de commits— se corrijan en un solo sitio y se vuelva a compilar.

## Archivos

| Archivo | Qué hace |
|---|---|
| `build_doc.py` | Infraestructura del documento: estilos, encabezado con el logo institucional, pie con «Página X de Y» y los helpers de contenido (`h1`, `h2`, `h3`, `para`, `bullet`, `add_table`, `code_block`, `callout`, `figure`, `diagram`, `boxes_row`, `field_placeholder`, `page_break`, `add_toc`). Define la ruta de salida. Copia del de la Actividad 1 con las rutas cambiadas. |
| `content_doc.py` | El contenido: portada, tabla de contenido y las 21 secciones. **Es el archivo que hay que editar** para cambiar el documento. |
| `charts.py` | Los 5 gráficos de `img/`, con la paleta exacta de `assets/css/02-tokens.css`. |
| `img/` | Los gráficos generados (`chart-*.png`, 200 ppp) y las 4 capturas de pantalla (`captura-*.jpg`, copiadas de `docs/capturas/`). |
| `refmedia/` | Se crea al vuelo: el logo institucional extraído de `../../EV1/Pedraza_Jeremy_TallerDOFA.docx`. No hace falta versionarlo. |

## Regenerar

```bash
cd docs/iudigital_doc/EV2/generador
python charts.py          # solo si cambian los datos de los gráficos
python content_doc.py     # produce el .docx
```

Requiere `python-docx` y `matplotlib`:

```bash
python -m pip install python-docx matplotlib
```

Para revisar el resultado sin abrir Word (requiere LibreOffice):

```bash
soffice --headless --convert-to pdf --outdir preview \
  ../CreditSmart_Arquitectura_EV2_generado.docx
```

## Regla de escritura: nunca sobre un archivo editado a mano

`build_doc.py` escribe **siempre** en `CreditSmart_Arquitectura_EV2_generado.docx`.
Si se edita el documento a mano (recortes, capturas pegadas, reordenamientos),
guárdalo con otro nombre —por ejemplo `CreditSmart_Arquitectura_EV2.docx`— para
que una regeneración no lo sobrescriba. Esa regla existe porque en la Actividad 1
una regeneración destruyó una versión editada a mano.

Cambiar el destino es una única línea en `build_doc.py` (`OUT_DOCX`).

## Gráficos

| Archivo | Qué muestra |
|---|---|
| `chart-migracion.png` | Archivos por capa antes y después de la migración: el dominio no cambia |
| `chart-react.png` | Composición de la capa de presentación en React (25 archivos) |
| `chart-tasas.png` | Tasa efectiva anual de los seis productos |
| `chart-cuota-plazo.png` | Efecto del plazo sobre la cuota y sobre el coste total |
| `chart-interes-capital.png` | Reparto entre intereses y capital, año a año |

`charts.py` calcula la cuota con **la misma fórmula del dominio** (sistema
francés, tasa mensual equivalente de la efectiva anual), así que las cifras de
los gráficos coinciden con las que muestra la aplicación. Si cambia
`CreditSimulationService`, hay que revisar la función `cuota()`.

El catálogo está duplicado en la constante `PRODUCTS` de `charts.py`: si se
edita `src/data/creditsData.js`, hay que actualizarla en paralelo.

## Espacios editables

`content_doc.py` deja 5 huecos amarillos para completar antes de entregar:

1. Ciudad y fecha de entrega (portada).
2. Capturas opcionales en móvil y tableta (§17.3).
3. Columna de autoevaluación de la rúbrica (§18).
4. Observaciones del estudiante (§18.1).
5. URL del repositorio y captura del historial de commits (§19).

La tabla de contenido es un campo de Word: al abrir el documento hay que hacer
clic derecho sobre ella y elegir «Actualizar campos».

## Datos que el documento cita del código

Si se cambia el código, revisar en `content_doc.py`:

- §4.1 «Cifras de la solución»: archivos por capa, contratos, casos de uso,
  dependencias del contenedor, aserciones de la suite.
- §5.1: la tabla de impacto por capa y los datos de `chart-migracion.png`.
- §8: la tabla de los once componentes y sus props.
- §9.2: los siete hooks propios.
- §12.3: las cifras de la simulación de ejemplo.
- §13.2: las reglas y los mensajes de validación.
- §17: resultados de las comprobaciones automáticas y manuales.
- §19.2: la lista de commits.

## Patrón de diseño que replica

El mismo de la Actividad 1, tomado del documento guía institucional
`../../EV1/Pedraza_Jeremy_TallerDOFA.docx`:

| Elemento | Valor |
|---|---|
| Tipografía | Arial 11 pt, interlineado 1,15, cuerpo justificado |
| Título 1 | Arial 16 pt negrita, `#1F3864` |
| Título 2 | Arial 13 pt negrita, `#2E75B6` |
| Título 3 | Arial 12 pt negrita, `#1F4D78` |
| Tablas | Centradas, borde `#7F7F7F`, encabezado `#1F3864` con texto blanco 9 pt, filas alternas `#F2F6FB`, ancho fijo |
| Página | Carta, márgenes de 1 pulgada (superior 3,3 cm para el logo) |
| Encabezado / pie | Logo institucional a la derecha · «Página X de Y» centrado, como campos de Word |
