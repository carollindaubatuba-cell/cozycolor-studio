import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const PUBLIC_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

/** Emits sw.js with every built file precached, so the whole app works offline after one visit. */
function serviceWorker(): Plugin {
  return {
    name: 'cozycolor-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = [...new Set([...PUBLIC_FILES, ...Object.keys(bundle).map((f) => `./${f}`)])];
      const version = createHash('sha1').update(files.join('|')).digest('hex').slice(0, 10);
      const source = readFileSync(new URL('./src/sw-template.js', import.meta.url), 'utf8')
        .replace('__VERSION__', version)
        .replace('__PRECACHE__', JSON.stringify(files, null, 2));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

/**
 * Absolute site URL for social preview tags. On Vercel this is detected automatically
 * from VERCEL_PROJECT_PRODUCTION_URL; elsewhere set SITE_URL, or the tag falls back to a relative path.
 */
function siteUrl(): Plugin {
  const host = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '.');
  return {
    name: 'cozycolor-site-url',
    transformIndexHtml: (html) => html.split('%SITE_URL%').join(host.replace(/\/$/, '')),
  };
}

// Relative base so the built app works from any static host or subfolder.
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker(), siteUrl()],
});
