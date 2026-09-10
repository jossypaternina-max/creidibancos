/**
 * vite.config.js — configuración del empaquetador.
 *
 * Vite solo participa en el desarrollo y en el empaquetado: no aparece en
 * ninguna capa de la arquitectura. El dominio, la aplicación y la
 * infraestructura son módulos ES estándar y siguen ejecutándose sin él.
 *
 * Capa: CONFIGURACIÓN (herramienta, no dependencia del código).
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
