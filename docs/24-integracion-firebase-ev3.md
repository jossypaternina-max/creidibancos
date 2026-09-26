# 24 — Integración con Firebase / Firestore (Actividad 3)

De guardar en memoria a **persistir en la nube**. La Actividad 3 sustituye la
fuente de datos —catálogo estático y `localStorage`— por **Cloud Firestore**,
sin tocar el dominio, la aplicación ni la presentación. Como en las entregas
anteriores: cambió el adaptador, no el hexágono.

## 24.1 Qué se pidió (rúbrica)

| Criterio | Dónde se cumple |
|---|---|
| Configuración de Firebase + variables de entorno | `.env` / `.env.example` · `config/dependencies.js` (`readFirebaseConfig`) · `infrastructure/firebase/FirebaseClient.js` |
| READ — listar créditos (`getDocs`, loading, try-catch, id) | `FirestoreCreditProductRepository` · `hooks/useCreditProducts.js` |
| CREATE — guardar solicitudes (`addDoc`, validación, limpiar, redirigir) | `FirestoreCreditApplicationRepository.save` · `hooks/useApplicationForm.js` · `pages/ApplicationPage.jsx` |
| Consultas y filtros (`where` + `orderBy`, Mis Solicitudes por correo) | `FirestoreCreditApplicationRepository.findByApplicantEmail` · `usecases/ListMyApplicationsUseCase.js` · `pages/MyApplicationsPage.jsx` |
| Manejo de errores (try-catch en todo, mensajes claros) | try/catch en los repos + `Result.fromError` en los casos de uso + toasts/estados en los hooks + tope de tiempo por operación |
| Seguridad — variables de entorno | `import.meta.env.VITE_FIREBASE_*` · `.env` en `.gitignore` · `.env.example` versionado |

## 24.2 Dónde encaja cada pieza (regla de dependencia intacta)

```
presentación (React)                 application                 domain
 MyApplicationsPage ─ useMyApplications ─ ListMyApplicationsUseCase ─┐
 ApplicationPage    ─ useApplicationForm ─ SubmitCreditApplicationUseCase ─┤ (puertos)
                                                                          ▼
                              infrastructure ── FirestoreCredit*Repository
                                             └─ FirebaseClient (recurso técnico)
```

- **`FirebaseClient`** — recurso técnico (como una conexión a BD). Inicializa la
  app de Firebase y expone Firestore. No implementa ningún puerto → sin
  `assertImplements`. La configuración entra por constructor; la lee el
  composition root, no la clase.
- **`FirestoreCreditProductRepository`** — adaptador de `ICreditProductRepository`.
  `getDocs('productos')`. Si la colección está vacía, la siembra en segundo
  plano desde el catálogo base (`CreditProductFactory` traduce doc → entidad).
- **`FirestoreCreditApplicationRepository`** — adaptador de
  `ICreditApplicationRepository`. `addDoc` en `save`, `getDocs` en `findAll`,
  `where` + `orderBy` en `findByApplicantEmail`. `CreditApplicationFactory`
  reconstruye la entidad y sus value objects desde el documento.
- **`ListMyApplicationsUseCase`** — query que devuelve DTOs planos vía
  `CreditApplicationMapper.toDTO`. Nunca devuelve entidades ni lanza.

El único archivo que cambió para pasar a Firestore es
`config/dependencies.js`: se registró `firebaseClient` y se cambiaron las dos
líneas de `productRepository` y `applicationRepository`. El dominio, los casos
de uso y las vistas no se enteraron.

## 24.3 Contrato ampliado

`ICreditApplicationRepository` ganó un método: `findByApplicantEmail(email)`.
Se añadió al puerto (dominio) **y** a las dos implementaciones (Firestore y la
de `localStorage`, que queda como respaldo), porque `assertImplements` verifica
todos los métodos al arrancar: un método faltante rompe la carga de la página,
no una navegación posterior.

## 24.4 Modelo de datos

**`productos/{id}`** — claves en español del catálogo base (`nombre`,
`descripcion`, `montoMin`, `montoMax`, `tasa`, `plazo`, `requisitos`, `icon`,
`palette`). El id del documento = id del producto (siembra idempotente con
`setDoc`).

**`solicitudes/{auto-id}`** — la forma de `CreditApplication.toJSON()`
(`id`, `status`, `reference`, `createdAt`, `applicant`, `requestedCredit`,
`employmentInfo`) más dos campos de nivel superior: `applicantEmail`
(minúsculas, para filtrar) y `createdAt` como fecha (para ordenar).

## 24.5 Degradación y errores

- **Sin `.env`** → `FirebaseClient.isConfigured === false`: catálogo estático,
  solicitudes en memoria. La app arranca y la suite pasa sin red.
- **Firestore caído / catálogo ilegible** → el repositorio de productos
  devuelve el catálogo estático (funcionalidad esencial: mejor local que vacío).
- **Índice compuesto ausente** en la consulta por correo → se degrada a `where`
  + orden en cliente.
- **Red desconectada / API deshabilitada** → cada operación tiene un tope de
  tiempo; el cuelgue se convierte en error visible (toast + estado de error).
  Es la prueba de "desconectar internet" de la actividad.

## 24.6 Verificación

```bash
node tests/01-domain-application.mjs   # dominio + aplicación -> TODO OK
node tests/02-boot-jsdom.mjs           # 7 rutas montan (incl. /mis-solicitudes) -> TODO OK
npm run build                          # compila sin errores
```

Las tres reglas de dependencia siguen devolviendo cero:

```bash
grep -rn "from '\.\./\.\./\(application\|infrastructure\|presentation\|config\)" src/domain/
grep -rn "from '\.\./\.\./\(infrastructure\|presentation\|config\)"              src/application/
grep -rn "infrastructure" src/components src/pages src/hooks src/context src/App.jsx
```

En navegador, con Firestore habilitado: abrir el catálogo (siembra + lectura),
registrar una solicitud, verla aparecer en Firebase Console → `solicitudes`,
consultarla en *Mis solicitudes* por correo, y desconectar la red para ver el
mensaje de error.
