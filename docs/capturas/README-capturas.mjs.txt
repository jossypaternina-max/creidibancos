/**
 * Capturas de pantalla de CreditSmart con Chromium headless (Edge instalado).
 *
 *   node capturas.mjs            # requiere el servidor de desarrollo en :5174
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://127.0.0.1:5174';
const OUT = 'C:/laragon/www/crediSmart/docs/capturas';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
});

async function shot(file, { url, width = 1440, height = 900, scale = 2, prepare }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  await page.goto(BASE + url, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  if (prepare) await prepare(page);
  await page.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: 88 });
  console.log('capturada:', file);
  await page.close();
}

/* 1. Catálogo */
await shot('01-catalogo.jpg', { url: '/' });

/* 2. Simulador con la cuota calculada */
await shot('02-simulador.jpg', {
  url: '/simulador',
  async prepare(page) {
    await page.waitForSelector('.sim-result');
  },
});

/* 3. Búsqueda en tiempo real y filtros */
await shot('03-busqueda-filtros.jpg', {
  url: '/simulador',
  async prepare(page) {
    await page.waitForSelector('#filter-query');
    await page.type('#filter-query', 'cr');
    await new Promise((r) => setTimeout(r, 400));
    const box = await page.evaluate(() => {
      const el = document.querySelector('.panel--filters');
      return el.getBoundingClientRect().top + window.scrollY - 90;
    });
    await page.evaluate((y) => window.scrollTo(0, y), box);
    await new Promise((r) => setTimeout(r, 400));
  },
});

/* 4. Formulario con validación en vivo */
await shot('04-formulario-validaciones.jpg', {
  url: '/solicitar',
  async prepare(page) {
    await page.waitForSelector('#field-email');
    await page.type('#field-idNumber', '123');
    await page.type('#field-email', 'jeremy@correo');
    await new Promise((r) => setTimeout(r, 500));
  },
});

/* 5. Responsive: catálogo en móvil */
await shot('05-responsive-movil.jpg', {
  url: '/',
  width: 414,
  height: 860,
});

/* 6. Responsive: simulador en tableta */
await shot('06-responsive-tableta.jpg', {
  url: '/simulador',
  width: 820,
  height: 1000,
  async prepare(page) {
    await page.waitForSelector('.sim-result');
  },
});

await browser.close();
console.log('listo');
