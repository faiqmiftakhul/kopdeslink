// KopdesLink — service worker minimal (offline-friendly shell cache).
const CACHE = 'kopdeslink-v1';
const SHELL = ['/', '/pos', '/inventory', '/matchmaking', '/dashboard', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  // API: network-first (data harus segar); fallback ke cache saat offline.
  if (new URL(request.url).pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  // Shell: cache-first.
  e.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
