import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AppConfig } from './config/AppConfig.js';
import { buildContainer } from './config/dependencies.js';
import { DependenciesProvider } from './context/DependenciesProvider.jsx';
import { App } from './App.jsx';

/* Estilos en cascada explícita: reset -> tokens -> base -> layout ->
   componentes -> páginas -> responsive. Se importan aquí, en el arranque, para
   que Vite los empaquete en ese orden y ningún componente dependa de que otro
   haya cargado su hoja antes. */
import '../assets/css/01-reset.css';
import '../assets/css/02-tokens.css';
import '../assets/css/03-base.css';
import '../assets/css/04-layout.css';
import '../assets/css/05-components.css';
import '../assets/css/06-pages.css';
import '../assets/css/07-responsive.css';

/**
 * main.jsx — COMPOSITION ROOT de la aplicación.
 *
 * Hace tres cosas y ninguna más:
 *   1. Construye el grafo de dependencias (dominio, infraestructura,
 *      aplicación) con `buildContainer`.
 *   2. Fuerza su construcción completa con `eagerResolveAll()`, para que una
 *      violación de contrato falle al cargar la página y no a mitad de una
 *      navegación.
 *   3. Monta React envolviendo la app en el proveedor de dependencias y en el
 *      router.
 *
 * Es el equivalente del `main.js` de la Actividad 1: mismo papel, mismo grafo,
 * distinto adaptador de interfaz.
 *
 * Capa: CONFIGURACIÓN / arranque.
 */
function bootstrap() {
  const mountPoint = document.querySelector(AppConfig.selectors.root);

  if (!mountPoint) {
    throw new Error(
      `No existe el punto de montaje "${AppConfig.selectors.root}" en el documento.`,
    );
  }

  const container = buildContainer({ config: AppConfig }).eagerResolveAll();

  createRoot(mountPoint).render(
    <StrictMode>
      <DependenciesProvider container={container}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DependenciesProvider>
    </StrictMode>,
  );
}

bootstrap();
