// SmartDeals.in Service Worker - Enables PWA App Download/Installation & Fast Offline Experience
const CACHE_NAME = 'smartdeals-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Let browser network handle API / dynamic calls directly, with fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
