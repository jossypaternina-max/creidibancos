# Generador de los documentos de la Actividad 3 (.docx)

Scripts que producen los dos entregables Word de la Actividad 3 (integración con
Firebase / Firestore):

- **`../CreditSmart_Firebase_EV3_generado.docx`** — documento técnico.
- **`../guion-sustentacion-EV3.docx`** — guion del video (3–4 min) y de la
  sustentación.

Como en la Actividad 2, el documento no se escribe a mano: se genera desde estos
scripts para que los datos que cita se corrijan en un solo sitio y se recompile.

## Archivos

| Archivo | Qué hace |
|---|---|
| `build_doc.py` | Infraestructura del documento: estilos, encabezado con el logo institucional, pie con «Página X de Y» y los helpers de contenido (`h1`, `h2`, `para`, `bullet`, `add_table`, `code_block`, `callout`, `figure`, `diagram`, `boxes_row`, `field_placeholder`, `page_break`, `add_toc`). Define la ruta de salida del documento técnico. Copia del de EV2 con las rutas cambiadas. |
| `content_doc.py` | El contenido del documento técnico: portada, TOC y 16 secciones. **Es el archivo que hay que editar** para cambiar el documento. |
| `guion_doc.py` | El guion del video/sustentación. Reutiliza `build_doc.py` y guarda en `../guion-sustentacion-EV3.docx`. |
| `img/` | Las capturas de la aplicación (`captura-*.jpg`), tomadas con Chromium headless (Edge) sobre el servidor de desarrollo. |
| `refmedia/` | Se crea al vuelo: el logo institucional extraído de `../../EV1/Pedraza_Jeremy_TallerDOFA.docx`. No hace falta versionarlo. |

## Regenerar

```bash
cd docs/iudigital_doc/EV3/generador
python content_doc.py     # produce ../CreditSmart_Firebase_EV3_generado.docx
python guion_doc.py       # produce ../guion-sustentacion-EV3.docx
```

Requiere `python-docx`:

```bash
python -m pip install python-docx
```

## Capturas

Se tomaron con `puppeteer-core` + Microsoft Edge en modo headless, sobre
`npm run dev` (puerto 5174). Para regenerarlas hay que levantar el servidor y
correr un script de captura que recorre el catálogo, el simulador, el formulario,
la confirmación y «Mis solicitudes».

Las capturas del flujo de solicitud (confirmación y «Mis solicitudes» con datos)
se tomaron con la app en modo memoria (sin `.env`) para no depender de la red;
la interfaz es idéntica con Firestore detrás. La captura de la **consola de
Firebase** queda como recuadro amarillo en el documento (§4.2): hay que tomarla
de la propia consola una vez habilitado Firestore.

## Espacios editables (recuadros amarillos)

`content_doc.py` deja huecos para completar antes de entregar:

1. Ciudad y fecha de entrega (portada).
2. Captura de la consola de Firebase con las colecciones (§4.2).
3. Columna de autoevaluación de la rúbrica (§13).
4. Observaciones del estudiante (§13.1).
5. URL del repositorio y captura del historial de commits (§14).

La tabla de contenido es un campo de Word: al abrir el documento, clic derecho
sobre ella → «Actualizar campos».

## Regla de escritura: nunca sobre un archivo editado a mano

Los scripts escriben **siempre** en los archivos con sufijo `_generado` / los
nombres fijos de arriba. Si editas el `.docx` a mano (pegas la captura de la
consola, rellenas los huecos), guárdalo con otro nombre para que una
regeneración no lo sobrescriba.
