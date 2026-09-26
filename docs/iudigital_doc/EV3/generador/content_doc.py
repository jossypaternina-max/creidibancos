# -*- coding: utf-8 -*-
"""Contenido del documento de la Actividad 3 de CreditSmart (Firebase / Firestore)."""
from build_doc import *   # noqa: F401,F403  (helpers, estilos y objeto `doc`)
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

configure_styles()
build_header_footer()

C = WD_ALIGN_PARAGRAPH.CENTER
J = WD_ALIGN_PARAGRAPH.JUSTIFY

# ============================================================== PORTADA
for text in (u'S40 · Actividad 3 — Evidencia de Aprendizaje 3',
             u'Ingeniería Web',
             u'CreditSmart — Integración con Backend Firebase (Firestore)'):
    p = doc.add_paragraph(text, style='Heading 1')
    p.alignment = C
    p.paragraph_format.space_after = Pt(2)

para(u'Documento técnico: persistencia de datos en la nube con Cloud Firestore, '
     u'operaciones CRUD (addDoc, getDocs), consultas con where y orderBy, comunicación '
     u'asíncrona, manejo de errores y variables de entorno, sobre la arquitectura '
     u'hexagonal construida en las Actividades 1 y 2.',
     align=C, size=11, italic=True, color='6B7280', space_after=18)

para(u'Integrantes', align=C, size=11, bold=True, space_after=2)
para(u'Jeremy Ivan Pedraza Hernández', align=C, size=11, space_after=1)
para(u'Jossy Esteban Paternina Julio', align=C, size=11, space_after=8)

para(u'Docente', align=C, size=11, bold=True, space_after=2)
para(u'Jorge Armando Julio', align=C, size=11, space_after=8)

para(u'Curso y NRC', align=C, size=11, bold=True, space_after=2)
para(u'Ingeniería Web — PREICA2602B010133', align=C, size=11, space_after=14)

para(u'Ingeniería de Software y Datos', align=C, bold=True, space_after=2)
para(u'Facultad de Ingeniería y Ciencias Agropecuarias', align=C, space_after=2)
para(u'Institución Universitaria Digital de Antioquia', align=C, space_after=2)
para(u'2026-S2', align=C, space_after=10)
field_placeholder(u'[ Ciudad y fecha de entrega ]', width_cm=8.0)

page_break()

# ============================================================== TABLA DE CONTENIDO
h1(u'Tabla de contenido')
para(u'Para actualizar el índice: seleccione la tabla, haga clic derecho y elija '
     u'«Actualizar campos» → «Actualizar toda la tabla».', size=9,
     italic=True, color='6B7280')
add_toc()
page_break()

# ============================================================== 1. INTRODUCCION
h1(u'1. Introducción')
para(u'CreditSmart es una plataforma web para consultar, simular y solicitar productos '
     u'de crédito. En la Actividad 1 se construyó con JavaScript estándar sobre una '
     u'arquitectura hexagonal; en la Actividad 2 su interfaz se reescribió en React sin '
     u'tocar el núcleo. En ambas, los datos vivían solo en memoria y en el navegador: al '
     u'cerrar la pestaña, las solicitudes se perdían.')
para(u'Esta Actividad 3 conecta CreditSmart con Firebase, la plataforma de Google que '
     u'ofrece backend como servicio (BaaS), y en particular con Cloud Firestore, su base '
     u'de datos NoSQL. A partir de ahora el catálogo de productos y las solicitudes de '
     u'crédito se almacenan en la nube, persisten entre sesiones y pueden consultarse, '
     u'crearse y filtrarse desde cualquier dispositivo.')
para(u'La tesis del documento es la misma que sostuvo la migración a React: cambiar de '
     u'fuente de datos no fue una reescritura, sino la sustitución de un adaptador. La '
     u'arquitectura hexagonal define puertos (interfaces) que el dominio conoce y que la '
     u'infraestructura implementa. Pasar de datos estáticos y localStorage a Firestore '
     u'significó escribir dos adaptadores nuevos y cambiar unas líneas del contenedor de '
     u'dependencias. El dominio, los casos de uso y las vistas no se enteraron.')

callout(u'Cómo leer este documento',
        u'Las figuras muestran la aplicación real funcionando y las tablas contienen el '
        u'detalle exacto (colecciones, campos, operaciones). Los bloques grises son '
        u'fragmentos reales del código fuente. Los recuadros amarillos son espacios '
        u'editables que hay que completar antes de entregar —entre ellos, la captura de '
        u'la consola de Firebase y el video demostrativo.')

# ============================================================== 2. OBJETIVO
h1(u'2. Objetivo')
h2(u'2.1 Objetivo general')
para(u'Aplicar los conceptos de persistencia de datos, base de datos NoSQL (Firestore), '
     u'operaciones CRUD y comunicación asíncrona para integrar CreditSmart con Firebase, '
     u'permitiendo que los datos se almacenen en la nube, se consulten y persistan entre '
     u'sesiones, sin degradar la separación entre la interfaz, las reglas del negocio y '
     u'la tecnología de persistencia.')

h2(u'2.2 Objetivos específicos')
for t in (u'Configurar un proyecto de Firebase, registrar una app web y habilitar Cloud '
          u'Firestore como base de datos NoSQL.',
          u'Instalar y configurar el SDK modular de Firebase en el proyecto React, '
          u'leyendo las credenciales desde variables de entorno de Vite.',
          u'Implementar la operación READ del catálogo con getDocs, con estado de carga '
          u'y manejo de errores, mapeando cada documento a la entidad del dominio.',
          u'Implementar la operación CREATE de solicitudes con addDoc, validando antes '
          u'de guardar, limpiando el formulario y redirigiendo tras el éxito.',
          u'Implementar consultas con where y orderBy en una página «Mis solicitudes» '
          u'que filtra por el correo del solicitante.',
          u'Manejar errores con try-catch en todas las operaciones y mostrar mensajes '
          u'claros al usuario, incluida la prueba de desconexión de red.',
          u'Proteger las credenciales con variables de entorno, dejando .env fuera del '
          u'control de versiones y documentando las claves en .env.example.',
          u'Demostrar, con evidencia medible, que la persistencia en la nube fue un '
          u'cambio de adaptador y no una reescritura del sistema.'):
    bullet(t)

# ============================================================== 3. ALCANCE
h1(u'3. Alcance y requerimientos')
h2(u'3.1 Requerimientos funcionales')
add_table(
    [u'ID', u'Requerimiento', u'Dónde se implementa'],
    [[u'RF-1', u'El catálogo de productos se lee desde Firestore (getDocs).',
      u'FirestoreCreditProductRepository'],
     [u'RF-2', u'Las solicitudes se guardan permanentemente en Firestore (addDoc).',
      u'FirestoreCreditApplicationRepository.save'],
     [u'RF-3', u'Se pueden consultar las solicitudes de un correo (where + orderBy).',
      u'findByApplicantEmail · ListMyApplicationsUseCase'],
     [u'RF-4', u'La interfaz muestra un estado de carga mientras lee de la nube.',
      u'useCreditProducts · useMyApplications'],
     [u'RF-5', u'Los errores de red se muestran al usuario con un mensaje claro.',
      u'try-catch + Result + avisos (toasts)'],
     [u'RF-6', u'Los datos persisten aunque se cierre el navegador.',
      u'Cloud Firestore'],
     [u'RF-7', u'Tras registrar una solicitud, se redirige a «Mis solicitudes».',
      u'ApplicationPage → MyApplicationsPage']],
    widths=[1.3, 8.6, 6.5])
cap(u'Requerimientos funcionales de la Actividad 3', kind='Tabla')

h2(u'3.2 Requerimientos no funcionales')
for t in (u'Seguridad: las credenciales de Firebase no se versionan; entran por '
          u'variables de entorno (import.meta.env).',
          u'Resiliencia: si Firebase no está configurado o la red falla, la aplicación '
          u'degrada a datos locales en lugar de romperse.',
          u'Asincronía: toda operación con Firestore es asíncrona (async/await) y no '
          u'bloquea la interfaz; un tope de tiempo evita cuelgues.',
          u'Compatibilidad con la arquitectura: la persistencia en la nube no viola la '
          u'regla de dependencia ni obliga a tocar el dominio.',
          u'Consumo dentro del plan gratuito de Firestore (50K lecturas y 20K '
          u'escrituras al día).'):
    bullet(t)

# ============================================================== 4. CONFIGURACION FIREBASE
h1(u'4. Configuración de Firebase')
h2(u'4.1 Proyecto y app web')
para(u'Se creó un proyecto en la consola de Firebase y, dentro de él, una aplicación '
     u'web. La consola entrega un objeto de configuración (firebaseConfig) con las '
     u'claves del proyecto: apiKey, authDomain, projectId, storageBucket, '
     u'messagingSenderId y appId.')

h2(u'4.2 Habilitar Cloud Firestore')
para(u'En Compilación → Firestore Database se creó la base de datos en modo de prueba, '
     u'que abre las reglas de lectura y escritura durante 30 días —suficiente para la '
     u'entrega—. Al ejecutar la aplicación por primera vez, la colección de productos se '
     u'siembra automáticamente con el catálogo base.')
figure_or_placeholder = True
field_placeholder(u'[ Pegue aquí la captura de la consola de Firebase mostrando las '
                  u'colecciones «productos» y «solicitudes» con sus documentos ]',
                  width_cm=15.0, height_cm=6.0)
cap(u'Consola de Firebase con las colecciones de Firestore', kind='Figura')

h2(u'4.3 Variables de entorno')
para(u'La configuración no se escribe en el código: se lee de variables de entorno de '
     u'Vite, que solo expone al navegador las que llevan el prefijo VITE_. El composition '
     u'root (config/dependencies.js) las lee y se las inyecta por constructor a '
     u'FirebaseClient; ninguna otra clase lee configuración global.')
code_block([
    u'# .env  (este archivo está en .gitignore: nunca se sube al repositorio)',
    u'VITE_FIREBASE_API_KEY=...' ,
    u'VITE_FIREBASE_AUTH_DOMAIN=iudigital-creditsmart.firebaseapp.com',
    u'VITE_FIREBASE_PROJECT_ID=iudigital-creditsmart',
    u'VITE_FIREBASE_STORAGE_BUCKET=iudigital-creditsmart.firebasestorage.app',
    u'VITE_FIREBASE_MESSAGING_SENDER_ID=...' ,
    u'VITE_FIREBASE_APP_ID=...' ,
], caption=u'Archivo .env con las credenciales (valores recortados)')

callout(u'Seguridad',
        u'.env está en .gitignore y se versiona .env.example con las claves pero sin '
        u'valores. La apiKey de una app web de Firebase es un identificador público del '
        u'proyecto, no un secreto: la seguridad real la dan las reglas de Firestore. Aun '
        u'así se mantiene fuera de git, como pide la rúbrica.',
        fill=WARN_BG, border=AMBER, icon=u'!')

# ============================================================== 5. ARQUITECTURA
h1(u'5. Firebase como un adaptador más')
h2(u'5.1 La regla de dependencia no cambió')
para(u'El dominio define puertos (interfaces) y la infraestructura los implementa. Las '
     u'flechas apuntan siempre hacia el núcleo: la presentación depende de la aplicación, '
     u'la aplicación del dominio, y la infraestructura también del dominio. Firestore es '
     u'un detalle de infraestructura que el dominio nunca conoce.')
boxes_row([
    (u'PRESENTACIÓN\n(React)', BRAND),
    (u'APLICACIÓN\n(casos de uso)', VIOLET),
    (u'DOMINIO\n(puertos)', NAVY),
    (u'INFRAESTRUCTURA\n(Firestore)', AMBER),
])
cap(u'La infraestructura implementa los puertos del dominio; la dependencia apunta al núcleo')

h2(u'5.2 El único archivo que cambió para ir a la nube')
para(u'Pasar de datos estáticos y localStorage a Firestore fue cambiar el cableado en '
     u'config/dependencies.js: registrar el cliente de Firebase y apuntar los dos '
     u'repositorios a sus adaptadores de Firestore. Ni el dominio, ni los casos de uso, '
     u'ni un solo componente se modificaron.')
code_block([
    u"container.register('firebaseClient', (c) =>",
    u"  new FirebaseClient({ config: readFirebaseConfig(), logger: c.resolve('logger') }));",
    u"",
    u"container.register('productRepository', (c) =>",
    u"  assertImplements(new FirestoreCreditProductRepository({",
    u"    firebaseClient: c.resolve('firebaseClient'), logger: c.resolve('logger'),",
    u"  }), ICreditProductRepository));",
    u"",
    u"container.register('applicationRepository', (c) =>",
    u"  assertImplements(new FirestoreCreditApplicationRepository({",
    u"    firebaseClient: c.resolve('firebaseClient'),",
    u"    idGenerator: c.resolve('idGenerator'), logger: c.resolve('logger'),",
    u"  }), ICreditApplicationRepository));",
], caption=u'config/dependencies.js: el cambio de adaptador vive en un solo lugar')

h2(u'5.3 Contratos verificados al arrancar')
para(u'El puerto de solicitudes ganó un método, findByApplicantEmail, para la consulta '
     u'por correo. Se añadió al contrato del dominio y a las dos implementaciones '
     u'(Firestore y la de localStorage, que queda como respaldo). assertImplements '
     u'comprueba en el arranque que cada adaptador cumple su contrato: un método faltante '
     u'rompe la carga de la página, no una navegación posterior.')

# ============================================================== 6. MODELO DE DATOS
h1(u'6. Modelo de datos en Firestore')
para(u'Firestore es una base de datos NoSQL orientada a documentos: los datos se '
     u'organizan en colecciones de documentos, cada uno un conjunto de campos. '
     u'CreditSmart usa dos colecciones.')
add_table(
    [u'Colección', u'Documento', u'Campos principales', u'Operaciones'],
    [[u'productos', u'un producto de crédito',
      u'nombre, descripcion, montoMin, montoMax, tasa, plazo, requisitos, icon, palette',
      u'getDocs, setDoc (siembra)'],
     [u'solicitudes', u'una solicitud radicada',
      u'id, status, reference, createdAt, applicantEmail, applicant{}, requestedCredit{}, '
      u'employmentInfo{}',
      u'addDoc, getDocs, where, orderBy']],
    widths=[2.6, 3.2, 7.6, 3.0])
cap(u'Las dos colecciones de Firestore', kind='Tabla')
para(u'El documento de solicitud guarda la forma serializada de la entidad más dos '
     u'campos de nivel superior: applicantEmail (en minúsculas, para filtrar) y createdAt '
     u'como fecha (para ordenar). Una factory reconstruye la entidad del dominio y sus '
     u'value objects al leer de Firestore, validando en la frontera.')

# ============================================================== 7. READ
h1(u'7. Operación READ — listar créditos')
para(u'El catálogo se lee de Firestore con getDocs. Si la colección está vacía, se '
     u'siembra en segundo plano con el catálogo base y se devuelven los datos locales de '
     u'inmediato, para que la pantalla nunca quede en espera. Cada documento se mapea a '
     u'la entidad del dominio conservando su identificador.')
code_block([
    u"const snapshot = await getDocs(collection(this.#db, 'productos'));",
    u"return snapshot.docs.map((d) => CreditProductFactory.fromRaw(d.data()));",
], caption=u'Lectura del catálogo con getDocs y mapeo a entidades')
para(u'El hook useCreditProducts invoca el caso de uso, desenvuelve el Result y expone a '
     u'la página un estado plano con isLoading y error. La página no sabe que existe un '
     u'Result, un repositorio ni Firestore.')
figure('captura-catalogo.jpg',
       u'Catálogo de CreditSmart cargando los productos desde Firestore.')

# ============================================================== 8. CREATE
h1(u'8. Operación CREATE — guardar solicitudes')
para(u'El formulario de solicitud, controlado y validado en tiempo real con las reglas '
     u'del dominio, envía la solicitud al caso de uso, que construye la entidad y la '
     u'persiste con addDoc. Tras el éxito, el formulario se limpia y la confirmación '
     u'muestra el número de radicado, con un enlace directo a «Mis solicitudes».')
code_block([
    u"const payload = {",
    u"  ...application.toJSON(),",
    u"  applicantEmail: application.applicant.email,",
    u"  createdAt: application.createdAt,",
    u"};",
    u"await addDoc(collection(this.#db, 'solicitudes'), payload);",
], caption=u'Guardado de la solicitud con addDoc')
figure('captura-solicitud-form.jpg',
       u'Formulario de solicitud por pasos, con validación en vivo.')
figure('captura-confirmacion.jpg',
       u'Confirmación con el número de radicado y el enlace a «Mis solicitudes».')

# ============================================================== 9. CONSULTAS
h1(u'9. Consultas y filtros')
para(u'La página «Mis solicitudes» consulta las solicitudes de un correo combinando '
     u'where y orderBy: filtra por applicantEmail y ordena por fecha descendente. Esa '
     u'combinación requiere un índice compuesto que Firestore ofrece crear con un clic la '
     u'primera vez; mientras no exista, la aplicación degrada a filtrar por where y '
     u'ordenar en el cliente, así que sigue funcionando.')
code_block([
    u"const q = query(",
    u"  collection(this.#db, 'solicitudes'),",
    u"  where('applicantEmail', '==', email),",
    u"  orderBy('createdAt', 'desc'),",
    u");",
    u"const snapshot = await getDocs(q);",
], caption=u'Consulta con where + orderBy')
figure('captura-mis-solicitudes.jpg',
       u'«Mis solicitudes»: solicitudes de un correo, consultadas con where y orderBy.')
para(u'Antes de buscar, la página muestra solo el campo de correo; durante la lectura, '
     u'un estado de carga; y si no hay resultados, un aviso claro.')
figure('captura-mis-solicitudes-vacio.jpg',
       u'Estado inicial de «Mis solicitudes», antes de consultar.')

# ============================================================== 10. ERRORES
h1(u'10. Manejo de errores')
para(u'Todas las operaciones con Firestore van dentro de try-catch. El repositorio '
     u'traduce cualquier fallo en un error con mensaje claro; el caso de uso lo convierte '
     u'en un Result de fallo; y el hook lo desenvuelve y lo muestra con un aviso y un '
     u'estado de error en pantalla. Además, un tope de tiempo por operación convierte una '
     u'desconexión de red en un error visible en lugar de un cuelgue: es lo que hace '
     u'demostrable la prueba de «desconectar internet».')
diagram([
    (u'I', u'Repositorio (Firestore)', u'try-catch: si falla la red, lanza un error con mensaje claro y registra el detalle en el logger.'),
    (u'A', u'Caso de uso', u'Atrapa el error y devuelve Result.fromError; nunca lanza hacia la interfaz.'),
    (u'P', u'Hook', u'Desenvuelve el Result, guarda el mensaje de error y avisa al usuario (toast).'),
    (u'P', u'Página', u'Muestra el estado de error o el aviso; la app no se rompe.'),
])
cap(u'Recorrido de un error desde Firestore hasta la interfaz')
para(u'La degradación es la otra cara del manejo de errores: sin credenciales, el '
     u'catálogo usa datos locales y las solicitudes quedan en memoria; si Firestore no '
     u'responde para el catálogo, se sirve el catálogo estático; si falta el índice '
     u'compuesto, la consulta ordena en el cliente. Se degrada antes que fallar.')

# ============================================================== 11. SEGURIDAD
h1(u'11. Seguridad — variables de entorno')
add_table(
    [u'Medida', u'Estado'],
    [[u'Credenciales en .env', u'Sí, leídas con import.meta.env.VITE_FIREBASE_*'],
     [u'.env en .gitignore', u'Sí: .env, .env.local y .env.*.local excluidos'],
     [u'.env.example versionado', u'Sí, con las claves pero sin valores reales'],
     [u'Credenciales en el código o en git', u'No: el repositorio no contiene secretos'],
     [u'Configuración inyectada por constructor', u'Sí: ninguna clase lee un global']],
    widths=[7.0, 9.4])
cap(u'Cumplimiento de seguridad de variables de entorno', kind='Tabla')

# ============================================================== 12. VERIFICACION
h1(u'12. Verificación')
h2(u'12.1 Comprobaciones automáticas')
add_table(
    [u'Comprobación', u'Comando', u'Resultado'],
    [[u'Dominio y aplicación', u'`node tests/01-domain-application.mjs`', u'TODO OK'],
     [u'Arranque de la interfaz (7 rutas)', u'`node tests/02-boot-jsdom.mjs`', u'TODO OK'],
     [u'Empaquetado de producción', u'`npm run build`', u'Sin errores'],
     [u'Regla de dependencia (3 grep)', u'`grep` sobre domain, application y presentación', u'Cero resultados']],
    widths=[6.0, 6.4, 4.0])
cap(u'Comprobaciones automáticas ejecutadas', kind='Tabla')
para(u'La suite de arranque construye todo el grafo de dependencias (incluidos el '
     u'cliente de Firebase y los repositorios de Firestore) y monta las siete rutas, '
     u'entre ellas la nueva «Mis solicitudes», sin dejar errores en consola.')

h2(u'12.2 Comprobación de la conexión con Firestore')
para(u'Se verificó la conexión real contra el proyecto con un script de humo que siembra '
     u'los productos, crea una solicitud de prueba con addDoc, la consulta con where + '
     u'orderBy y la borra. Es la misma secuencia que ejecuta la aplicación.')

h2(u'12.3 Comprobación en el navegador')
for t in (u'Cargar el catálogo y ver los productos desde Firestore.',
          u'Registrar una solicitud y verla aparecer en la consola de Firebase.',
          u'Consultar las solicitudes por correo en «Mis solicitudes».',
          u'Ver el estado de carga durante las lecturas.',
          u'Desconectar la red y comprobar que aparece un mensaje de error.'):
    bullet(t)
figure('captura-movil.jpg', u'La aplicación conserva su diseño responsive en móvil.')

# ============================================================== 13. RUBRICA
h1(u'13. Cumplimiento de la rúbrica')
add_table(
    [u'Criterio', u'Pts', u'Evidencia en el proyecto', u'Auto'],
    [[u'Configuración de Firebase', u'20',
      u'Proyecto y Firestore configurados; variables de entorno; .env en .gitignore '
      u'(§4, §11)', u''],
     [u'Operación READ — listar créditos', u'15',
      u'getDocs, estado de carga, try-catch, mapeo con id, render limpio (§7)', u''],
     [u'Operación CREATE — guardar solicitudes', u'20',
      u'addDoc, validación previa, limpieza del formulario y redirección (§8)', u''],
     [u'Consultas y filtros', u'15',
      u'where + orderBy; página «Mis solicitudes» filtrando por correo (§9)', u''],
     [u'Manejo de errores', u'10',
      u'try-catch en todas las operaciones, mensajes claros, tope de tiempo (§10)', u''],
     [u'Seguridad — variables de entorno', u'10',
      u'.env, .gitignore, .env.example, import.meta.env, sin secretos en git (§11)', u''],
     [u'Video demostrativo', u'10',
      u'Guion en guion-sustentacion-EV3.docx; grabación por realizar', u''],
     [u'Total', u'100', u'', u'']],
    widths=[4.2, 1.0, 9.4, 1.8], align_center_cols=(1, 3))
cap(u'Criterios de la rúbrica y evidencia. La última columna queda para la '
    u'autoevaluación', kind='Tabla')

h2(u'13.1 Observaciones del estudiante')
field_placeholder(u'[ Escriba aquí las observaciones que quiera añadir a la entrega ]',
                  width_cm=15.0, height_cm=3.0)

page_break()

# ============================================================== 14. ENTREGABLES
h1(u'14. Entregables')
h2(u'14.1 Repositorio')
field_placeholder(u'[ URL del repositorio Git ]', width_cm=13.0)
add_table(
    [u'Elemento', u'Estado'],
    [[u'Código fuente completo con integración Firebase', u'Incluido en src/'],
     [u'.env.example (sin credenciales reales)', u'Incluido'],
     [u'.gitignore que incluye .env', u'Incluido'],
     [u'README.md actualizado', u'Sección 2.1: configuración de Firebase'],
     [u'Documentación de diseño', u'docs/24-integracion-firebase-ev3.md; índice en master.md'],
     [u'Video demostrativo (3-4 min)', u'Por grabar (obligatorio)'],
     [u'Firebase Console con las colecciones', u'Captura por añadir (§4.2)']],
    widths=[7.6, 8.8])
cap(u'Contenido de la entrega', kind='Tabla')

h2(u'14.2 Historial de commits')
para(u'La entrega se desarrolló en la rama ev3-firebase, a partir de la Actividad 2.')
add_table(
    [u'#', u'Commit', u'Qué aporta'],
    [[u'1', u'feat: integra CreditSmart con Firebase Firestore (EV3)',
      u'Cliente de Firebase, repositorios de Firestore (CRUD con addDoc/getDocs/'
      u'where+orderBy), página «Mis solicitudes», variables de entorno, manejo de '
      u'errores y documentación']],
    widths=[0.9, 7.5, 8.0], align_center_cols=(0,))
cap(u'Commit de la rama ev3-firebase', kind='Tabla')
field_placeholder(u'[ Opcional: pegue aquí la captura del historial de commits ]',
                  width_cm=15.0, height_cm=4.0)

page_break()

# ============================================================== 15. CONCLUSIONES
h1(u'15. Conclusiones')
for t in (u'La integración con Firebase cubrió los seis criterios técnicos de la '
          u'rúbrica: configuración y variables de entorno, lectura del catálogo con '
          u'getDocs, creación de solicitudes con addDoc, consultas con where y orderBy, '
          u'manejo de errores y seguridad de credenciales.',
          u'La persistencia en la nube fue un cambio de adaptador. El dominio y los '
          u'casos de uso no se modificaron, y la suite que los cubre siguió pasando sin '
          u'ajustes. El único cambio de cableado vive en config/dependencies.js: dos '
          u'líneas de repositorio y el registro del cliente de Firebase.',
          u'Devolver siempre un Result desde los casos de uso y traducir los fallos de '
          u'Firestore en mensajes claros permitió que el manejo de errores fuera '
          u'uniforme en toda la aplicación, sin try-catch dispersos por la interfaz.',
          u'La degradación —datos locales sin credenciales, catálogo estático si '
          u'Firestore no responde, orden en cliente si falta el índice— hace que la '
          u'aplicación sea robusta ante configuraciones incompletas y fallos de red, que '
          u'es justamente lo que la actividad pide demostrar.',
          u'La factory que reconstruye la entidad desde el documento de Firestore repite '
          u'el patrón de capa anticorrupción de las actividades anteriores: si mañana '
          u'cambia la forma del documento, solo cambia ese archivo.'):
    bullet(t)

# ============================================================== 16. REFERENCIAS
h1(u'16. Referencias')
for ref in (
    u'Google. Firebase — Documentación oficial. firebase.google.com/docs',
    u'Google. Cloud Firestore — Get started. firebase.google.com/docs/firestore/quickstart',
    u'Google. Firestore — Add and manage data (CRUD). firebase.google.com/docs/firestore/manage-data/add-data',
    u'Google. Firestore — Perform simple and compound queries. firebase.google.com/docs/firestore/query-data/queries',
    u'Vite. Variables de entorno y modos. vite.dev/guide/env-and-mode',
    u'Meta Open Source. React — Documentación oficial. react.dev',
    u'Cockburn, A. Hexagonal Architecture (Ports and Adapters), 2005.',
    u'Martin, R. C. Clean Architecture. Prentice Hall, 2017.',
    u'Documentación interna: docs/24-integracion-firebase-ev3.md y docs/master.md.',
):
    bullet(ref)

para(u'Nota sobre el origen del contenido funcional: la aplicación es una '
     u'reconstrucción del sitio de referencia sweet-smart-credit-path.base44.app. La '
     u'arquitectura, la integración con Firebase, las validaciones y las pruebas son '
     u'desarrollo propio.', size=9, italic=True, color='6B7280')

doc.save(OUT_DOCX)
print(u'Documento generado: %s' % OUT_DOCX)
print(u'Figuras: %d   Tablas numeradas: %d' % (FIG_N[0], TAB_N[0]))
