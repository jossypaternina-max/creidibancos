import { useEffect } from 'react';

/**
 * useDocumentTitle — pone el título del documento al entrar en una página.
 *
 * Sustituye al decorador `DocumentTitleController` de la Actividad 1: mismo
 * efecto (título por ruta) expresado como hook, que es la forma que tiene
 * React de declarar efectos de ciclo de vida.
 *
 * @param {string} title
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
