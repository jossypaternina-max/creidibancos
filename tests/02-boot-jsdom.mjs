/**
 * 02-boot-jsdom.mjs — prueba de arranque de la interfaz.
 *
 * Monta la aplicación real —el mismo `App.jsx`, el mismo contenedor de
 * dependencias— dentro de un DOM simulado y recorre las seis rutas.
 *
 * No comprueba estética. Comprueba tres cosas que sí se pueden romper sin
 * darse cuenta al mover marcado de sitio:
 *
 *   1. Que el grafo de dependencias se resuelve entero. `eagerResolveAll()`
 *      construye las 30+ dependencias al arrancar, así que un contrato roto
 *      falla aquí y no a mitad de una navegación.
 *   2. Que cada vista pinta su contenido sin lanzar.
 *   3. Que ninguna ruta deja errores en consola.
 *
 * Vite se usa solo para traducir JSX y resolver los imports de CSS: la
 * aplicación se ejecuta tal cual.
 *
 * Requiere:  npm install jsdom --no-save
 * Uso:       node tests/02-boot-jsdom.mjs
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';
import { createServer } from 'vite';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let failures = 0;
const consoleErrors = [];

/**
 * @param {string} label
 * @param {boolean} condition
 * @param {string} [detail]
 */
function check(label, condition, detail = '') {
  if (condition) {
    console.log(`ok  : ${label}${detail ? ` (${detail})` : ''}`);
    return;
  }
  failures += 1;
  console.log(`FAIL: ${label}${detail ? ` (${detail})` : ''}`);
}

/* ---------- DOM simulado, ANTES de cargar nada de la aplicación ----------
   El adaptador de avisos busca `#notifications` y el repositorio de
   solicitudes usa `localStorage` en cuanto se construyen. */
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) => consoleErrors.push(error.message));
virtualConsole.on('error', (message) => consoleErrors.push(String(message)));

const dom = new JSDOM(
  '<!doctype html><html lang="es"><body><div id="root"></div>' +
    '<div id="notifications" class="notifications" aria-live="polite"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true, virtualConsole },
);

const { window } = dom;

globalThis.window = window;
globalThis.document = window.document;
globalThis.localStorage = window.localStorage;
globalThis.HTMLElement = window.HTMLElement;
globalThis.Node = window.Node;
globalThis.Event = window.Event;
globalThis.MutationObserver = window.MutationObserver;
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;

// jsdom no implementa matchMedia y el conmutador de tema lo consulta.
window.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/* ---------- Aplicación ---------- */
const vite = await createServer({
  root: ROOT,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

/* React se importa directo, no a través de Vite: son paquetes de Node ya
   publicados, y pasarlos por el transformador solo añade problemas. */
const { createElement } = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const { MemoryRouter } = await import('react-router-dom');

const { AppConfig } = await vite.ssrLoadModule('/src/config/AppConfig.js');
const { buildContainer } = await vite.ssrLoadModule('/src/config/dependencies.js');
const { DependenciesProvider } = await vite.ssrLoadModule('/src/context/DependenciesProvider.jsx');
const { App } = await vite.ssrLoadModule('/src/App.jsx');

let container = null;
try {
  container = buildContainer({ config: AppConfig }).eagerResolveAll();
  check('el contenedor resuelve todas las dependencias al arrancar', true);
} catch (error) {
  check('el contenedor resuelve todas las dependencias al arrancar', false, error.message);
}

/** Rutas a recorrer y un texto que debe aparecer en cada una. */
const ROUTES = [
  { path: '/', expect: 'Haz realidad' },
  { path: '/productos', expect: 'Nuestros productos' },
  { path: '/simulador', expect: 'Simula tu crédito' },
  { path: '/solicitar', expect: 'Solicitud de crédito' },
  { path: '/ayuda', expect: 'Preguntas frecuentes' },
  { path: '/ruta-que-no-existe', expect: 'No encontramos esta página' },
];

if (container) {
  for (const route of ROUTES) {
    let markup = '';
    let thrown = null;

    try {
      markup = renderToStaticMarkup(
        createElement(
          DependenciesProvider,
          { container },
          createElement(MemoryRouter, { initialEntries: [route.path] }, createElement(App)),
        ),
      );
    } catch (error) {
      thrown = error;
    }

    check(`${route.path} se pinta sin lanzar`, thrown === null, thrown?.message ?? '');
    check(
      `${route.path} muestra su contenido`,
      markup.includes(route.expect),
      route.expect,
    );
  }

  /* Comprobaciones transversales sobre la home: el armazón debe estar en
     todas las rutas, no dentro de cada página. */
  const home = renderToStaticMarkup(
    createElement(
      DependenciesProvider,
      { container },
      createElement(MemoryRouter, { initialEntries: ["/"] }, createElement(App)),
    ),
  );

  check('el enlace de salto al contenido existe', home.includes('skip-link'));
  check('la barra de navegación se pinta', home.includes('class="navbar"'));
  check('el pie se pinta', home.includes('class="footer"'));
  check('el conmutador de tema se pinta', home.includes('theme-toggle'));
  check('no quedan emojis de interfaz en el marcado', !/[\u{1F300}-\u{1FAFF}]/u.test(home));
}

check('ninguna ruta deja errores en consola', consoleErrors.length === 0, consoleErrors[0] ?? '');

await vite.close();

console.log(failures === 0 ? '\nTODO OK' : `\n${failures} COMPROBACIONES FALLIDAS`);
process.exit(failures === 0 ? 0 : 1);
