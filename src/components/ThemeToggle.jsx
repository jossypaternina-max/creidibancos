import { useCallback, useEffect, useState } from 'react';

import { Icon } from './Icon.jsx';

/**
 * ThemeToggle — alterna entre tema claro y oscuro.
 *
 * El estado inicial lo escribe `index.html` sobre `<html data-theme>` antes
 * del primer pintado, así que aquí solo hay que leerlo y alternarlo: sin
 * parpadeo al cargar.
 *
 * Sin valor guardado, el sitio sigue a `prefers-color-scheme` por CSS y el
 * botón no hace falta para que el tema funcione. Es una preferencia, no una
 * dependencia.
 *
 * El tema es estado de PRESENTACIÓN: no pasa por el contenedor de
 * dependencias, no toca el dominio y no viaja en ningún DTO.
 *
 * Capa: PRESENTACIÓN (componente).
 */

const STORAGE_KEY = 'creditsmart-theme';

/** @returns {boolean} */
function prefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

/** @returns {'light'|'dark'} Tema efectivo en este momento. */
function readCurrentTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return prefersDark() ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(readCurrentTheme);

  /* Mientras el usuario no elija, el sitio sigue al sistema: si el sistema
     cambia de tema a mitad de sesión, el botón refleja el cambio. */
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;

    function syncWithSystem() {
      if (!document.documentElement.hasAttribute('data-theme')) {
        setTheme(media.matches ? 'dark' : 'light');
      }
    }

    media.addEventListener('change', syncWithSystem);
    return () => media.removeEventListener('change', syncWithSystem);
  }, []);

  const toggle = useCallback(() => {
    const next = readCurrentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* Modo privado o almacenamiento bloqueado: el tema vale para esta
         sesión y no se recuerda. Degradar antes que fallar. */
    }
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      /* La etiqueta describe la ACCIÓN, no el estado actual. */
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} className="ui-icon ui-icon--sm" />
    </button>
  );
}
