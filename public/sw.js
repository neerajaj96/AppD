/**
 * UX-020 — Offline service worker (V2 content-chunk aware).
 *
 * The app is fully static. Content now ships as JSON chunks under
 * `./content/` (see `scripts/build-content-chunks.ts`) instead of a
 * TypeScript bundle; the only network dependency remains Google Fonts,
 * which degrades to system serif/sans. This worker makes the second visit
 * onwards work offline: same-origin GETs — including content chunks and
 * the search index — are cached on first use, navigations fall back to
 * the cached shell, and only this file's CACHE name needs a bump to
 * invalidate everything. No build plugin, no precache manifest to drift.
 */

const CACHE = 'darsana-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(['./', './index.html']))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients
      .claim()
      .then(() => caches.keys())
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('./index.html').then((hit) => hit || caches.match('index.html')),
      ),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(request);
      if (hit) return hit;
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    }),
  );
});
