import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(APP_DIR, '..');
const CORE_FILES = ['data.js', 'algorithm.js', 'grocery.js'];

// Base path of the deployed site: '/' for Cloudflare/Vercel/local, '/MealPrep/' for the GitHub
// Pages project site. Set by the deploy workflow; never hard-code it in source.
const BASE = process.env.DIALED_BASE || '/';

// The solver core (data.js, algorithm.js, grocery.js) stays at the repo root, byte-for-byte the
// files the Node test harness runs. They are classic scripts that define globals, so they are
// loaded ahead of the React bundle instead of being imported: in dev this middleware serves them
// straight from the repo root (any edit reloads the page); in a build they are copied to
// dist/core/ under a content-hashed name and precached by the service worker like everything else.
// src/core/index.js is the one module that reads those globals.
function coreScripts() {
  let base = '/';
  let isBuild = false;
  const hashed = {};
  return {
    name: 'dialed-core-scripts',
    configResolved(config) {
      base = config.base;
      isBuild = config.command === 'build';
      for (const f of CORE_FILES) {
        const src = fs.readFileSync(path.join(REPO_ROOT, f));
        const h = crypto.createHash('sha256').update(src).digest('hex').slice(0, 8);
        hashed[f] = { name: f.replace(/\.js$/, `-${h}.js`), src };
      }
    },
    configureServer(server) {
      for (const f of CORE_FILES) server.watcher.add(path.join(REPO_ROOT, f));
      server.middlewares.use((req, res, next) => {
        const m = /^\/core\/(data|algorithm|grocery)\.js(?:\?.*)?$/.exec(req.url || '');
        if (!m) return next();
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(fs.readFileSync(path.join(REPO_ROOT, `${m[1]}.js`)));
      });
    },
    hotUpdate({ file, server }) {
      if (CORE_FILES.some((f) => file === path.join(REPO_ROOT, f))) {
        server.hot.send({ type: 'full-reload' });
        return [];
      }
    },
    transformIndexHtml() {
      return CORE_FILES.map((f) => ({
        tag: 'script',
        attrs: { src: `${base}core/${isBuild ? hashed[f].name : f}` },
        injectTo: 'head',
      }));
    },
    generateBundle() {
      for (const f of CORE_FILES) {
        this.emitFile({ type: 'asset', fileName: `core/${hashed[f].name}`, source: hashed[f].src });
      }
    },
  };
}

// GitHub Pages has no single-page-app fallback: an unknown path (a deep link such as
// /fuel/grocery) is answered with 404.html. Shipping the app shell as 404.html makes those
// links load the app, which then routes client-side.
function spaFallback() {
  let outDir = 'dist';
  return {
    name: 'dialed-spa-fallback',
    apply: 'build',
    configResolved(config) { outDir = path.resolve(config.root, config.build.outDir); },
    closeBundle() {
      const index = path.join(outDir, 'index.html');
      if (fs.existsSync(index)) fs.copyFileSync(index, path.join(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    coreScripts(),
    spaFallback(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Dialed',
        short_name: 'Dialed',
        description: 'Nutrition, training and body — the plan adapts.',
        theme_color: '#0B0F14',
        background_color: '#0B0F14',
        display: 'standalone',
        orientation: 'portrait',
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2,ico}'],
        navigateFallback: `${BASE}index.html`,
        navigateFallbackDenylist: [/\/legacy\//],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  server: { port: 5173, strictPort: false },
});
