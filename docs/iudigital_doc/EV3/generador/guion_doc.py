# -*- coding: utf-8 -*-
"""Genera el guion de sustentacion / video de la Actividad 3 en .docx."""
import os
from build_doc import *   # noqa: F401,F403
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

configure_styles()
build_header_footer()

C = WD_ALIGN_PARAGRAPH.CENTER
GUION_OUT = os.path.join(OUT_DIR, 'guion-sustentacion-EV3.docx')


def speak(text):
    """Linea hablada: cita en azul, sangrada."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.8)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(u'“' + text + u'”')
    r.italic = True
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor.from_string('1F4D78')
    return p


def action(text):
    """Accion/indicacion de escena."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.8)
    p.paragraph_format.space_after = Pt(4)
    b = p.add_run(u'▶  ')
    b.bold = True
    b.font.color.rgb = RGBColor.from_string('10B981')
    r = p.add_run(text)
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor.from_string('374151')
    return p


# ============================================================== PORTADA
for text in (u'Guion de sustentación y video',
             u'Actividad 3 — Integración con Backend Firebase',
             u'CreditSmart'):
    p = doc.add_paragraph(text, style='Heading 1')
    p.alignment = C
    p.paragraph_format.space_after = Pt(2)
para(u'Video demostrativo (3–4 minutos) y sustentación sincrónica. El guion marca, para '
     u'cada momento, qué se dice (en cursiva azul) y qué se muestra en pantalla '
     u'(con ▶).', align=C, size=11, italic=True, color='6B7280', space_after=8)
para(u'Integrantes: Jeremy Ivan Pedraza Hernández · Jossy Esteban Paternina Julio',
     align=C, size=10, space_after=2)
para(u'Docente: Jorge Armando Julio — Ingeniería Web, IU Digital de Antioquia, 2026-S2',
     align=C, size=10, color='6B7280', space_after=10)

callout(u'Regla de oro del video',
        u'El video es OBLIGATORIO: sin él la actividad no se califica. Debe mostrar la '
        u'consola de Firebase y demostrar las operaciones CRUD. Dura 3–4 minutos: '
        u'ensaya para no pasarte.')

# ============================================================== 0. PREPARACION
h1(u'0. Antes de grabar (preparación)')
for t in (u'Verifica que Cloud Firestore está habilitado en la consola de Firebase '
          u'(Compilación → Firestore Database). Sin esto, las operaciones fallan.',
          u'Confirma que existe el archivo .env con las credenciales (no se sube a git).',
          u'Ejecuta npm run dev y abre la app en el navegador.',
          u'Abre en otra pestaña la consola de Firebase, en la vista de Firestore, para '
          u'mostrar las colecciones en vivo.',
          u'Ten a mano una terminal para el cierre (tests y reglas de dependencia).',
          u'Prepara un correo de prueba que usarás en la solicitud y en «Mis solicitudes».'):
    bullet(t)
callout(u'Comprobación de un minuto',
        u'Registra una solicitud de prueba antes de grabar y bórrala en la consola: así '
        u'confirmas que addDoc escribe y que la colección «solicitudes» aparece.',
        fill=WARN_BG, border=AMBER, icon=u'!')

# ============================================================== 1. APERTURA
h1(u'1. Apertura (20–30 s)')
speak(u'Hola. Somos Jeremy y Jossy. En la Actividad 3 conectamos CreditSmart con '
      u'Firebase. Hasta ahora los datos vivían en memoria; hoy viven en la nube, en '
      u'Cloud Firestore, y persisten aunque se cierre el navegador.')
speak(u'La idea que ordena toda la sustentación es esta: pasar a la nube no fue '
      u'reescribir la aplicación, fue cambiar un adaptador. La arquitectura hexagonal ya '
      u'estaba preparada para esto.')
action(u'Pantalla: la app abierta en el catálogo, con la consola de Firebase al lado.')

# ============================================================== 2. DEMO
h1(u'2. Demostración de las operaciones (2–2.5 min)')

h2(u'2.1 READ — el catálogo se lee de Firestore')
action(u'Abre / (catálogo). Muestra los productos cargados.')
action(u'Cambia a la consola de Firebase → colección «productos» con sus documentos.')
speak(u'El catálogo se lee de Firestore con getDocs. La primera vez, si la colección '
      u'está vacía, la aplicación la siembra sola con el catálogo base. Mientras carga, '
      u'la interfaz muestra un estado de carga, y si algo falla, un mensaje de error.')

h2(u'2.2 CREATE — registrar una solicitud')
action(u'Ve a /solicitar. Llena los tres pasos con datos válidos; usa el correo de prueba.')
speak(u'El formulario está controlado y se valida en vivo con las reglas del dominio. Al '
      u'enviar, la solicitud se guarda en Firestore con addDoc.')
action(u'Envía. Muestra la confirmación con el número de radicado.')
action(u'Cambia a la consola de Firebase → colección «solicitudes»: aparece el documento '
       u'nuevo. Ábrelo y muestra sus campos.')
speak(u'Ahí está, guardada en la nube. Tras el éxito, el formulario se limpia y podemos '
      u'ir directamente a «Mis solicitudes».')

h2(u'2.3 Consultas — «Mis solicitudes» por correo')
action(u'Haz clic en «Ver mis solicitudes». Escribe el correo y consulta.')
speak(u'Esta consulta combina where, para filtrar por el correo, y orderBy, para ordenar '
      u'por fecha de la más reciente a la más antigua. Aparece la solicitud que acabamos '
      u'de crear.')

h2(u'2.4 Manejo de errores — desconectar internet')
action(u'Abre DevTools → Network → Offline (o desconecta la red). Recarga «Mis '
       u'solicitudes» o intenta consultar.')
speak(u'Sin conexión, la operación no se cuelga: un tope de tiempo la convierte en un '
      u'error claro que se muestra al usuario. Todas las operaciones están dentro de '
      u'try-catch.')
action(u'Vuelve a poner la red en línea.')

# ============================================================== 3. CODIGO
h1(u'3. Recorrido del código (1 min)')

h3(u'Parada 1 — src/infrastructure/firebase/FirebaseClient.js')
speak(u'Aquí se inicializa Firebase. Lee la configuración de variables de entorno y '
      u'expone Firestore. Si faltan credenciales, degrada solo, no rompe.')

h3(u'Parada 2 — src/config/dependencies.js')
speak(u'Este es el único archivo que cambió para ir a la nube: registramos el cliente de '
      u'Firebase y apuntamos los dos repositorios a Firestore. El dominio y los casos de '
      u'uso no se tocaron.')
code_block([
    u"container.register('applicationRepository', (c) =>",
    u"  assertImplements(new FirestoreCreditApplicationRepository({",
    u"    firebaseClient: c.resolve('firebaseClient'),",
    u"    idGenerator: c.resolve('idGenerator'), logger: c.resolve('logger'),",
    u"  }), ICreditApplicationRepository));",
])

h3(u'Parada 3 — FirestoreCreditApplicationRepository.js')
speak(u'El CREATE es addDoc; el listado es getDocs; y la consulta por correo combina '
      u'where y orderBy. Todo dentro de try-catch, con un tope de tiempo por operación.')
code_block([
    u"const q = query(collection(this.#db, 'solicitudes'),",
    u"  where('applicantEmail', '==', email), orderBy('createdAt', 'desc'));",
    u"const snapshot = await getDocs(q);",
])

h3(u'Parada 4 — .env y .gitignore')
speak(u'Las credenciales están en .env, que está en .gitignore. Versionamos '
      u'.env.example con las claves pero sin valores. No hay secretos en el repositorio.')

# ============================================================== 4. CIERRE
h1(u'4. Cierre — verificación en la terminal (20–30 s)')
action(u'Terminal: ejecuta las pruebas y las reglas de dependencia.')
code_block([
    u'node tests/01-domain-application.mjs   # TODO OK',
    u'node tests/02-boot-jsdom.mjs           # 7 rutas -> TODO OK',
    u'npm run build                          # sin errores',
])
speak(u'Las pruebas siguen pasando después de mover la persistencia a la nube, porque el '
      u'dominio no cambió. Eso es la arquitectura hexagonal funcionando: cambiamos el '
      u'adaptador, no el sistema. Gracias.')

# ============================================================== 5. PREGUNTAS
h1(u'5. Preguntas probables y cómo responderlas')
add_table(
    [u'Pregunta', u'Respuesta breve'],
    [[u'¿La apiKey no es un secreto?',
      u'En una app web de Firebase es un identificador público del proyecto; la '
      u'seguridad la dan las reglas de Firestore. Aun así la mantenemos fuera de git.'],
     [u'¿Por qué NoSQL y no SQL?',
      u'Firestore es documental: cada solicitud es un documento con su estructura; no '
      u'necesitamos relaciones ni esquema fijo para este caso.'],
     [u'¿Qué pasa si se cae la red?',
      u'Cada operación tiene try-catch y un tope de tiempo; el error se muestra y la app '
      u'no se cuelga. Además degrada a datos locales cuando puede.'],
     [u'¿Por qué where y orderBy juntos piden un índice?',
      u'Firestore exige un índice compuesto para filtrar por un campo y ordenar por '
      u'otro; lo crea con un clic. Mientras tanto, ordenamos en el cliente.'],
     [u'¿Tuvieron que cambiar el dominio?',
      u'No. Solo escribimos dos adaptadores y cambiamos el contenedor de dependencias.']],
    widths=[5.5, 10.9])
cap(u'Preguntas frecuentes de la sustentación', kind='Tabla')

# ============================================================== 6. REPARTO
h1(u'6. Reparto sugerido entre los integrantes')
add_table(
    [u'Momento', u'Quién'],
    [[u'Apertura y demostración de la app (READ, CREATE, consulta, error)', u'Integrante 1'],
     [u'Recorrido del código y cierre en la terminal', u'Integrante 2'],
     [u'Preguntas', u'Ambos']],
    widths=[11.5, 4.9])
cap(u'Reparto sugerido', kind='Tabla')

# ============================================================== 7. ERRORES A EVITAR
h1(u'7. Errores a evitar en la grabación')
for t in (u'Empezar sin haber habilitado Firestore: las operaciones fallarían en vivo.',
          u'Olvidar mostrar la consola de Firebase: la rúbrica lo exige explícitamente.',
          u'Mostrar el archivo .env con las credenciales en pantalla.',
          u'Pasarse de 4 minutos: ensaya y recorta el recorrido de código si hace falta.',
          u'Leer el guion palabra por palabra: son apoyos, no un libreto rígido.'):
    bullet(t)

doc.save(GUION_OUT)
print(u'Guion generado: %s' % GUION_OUT)
