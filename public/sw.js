const CACHE_NAME = 'efforts1-cache-v1';
const OFFLINE_URL = '/index.html';

const URLS_TO_CACHE_ON_INSTALL = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE_ON_INSTALL);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Filter requests we want to cache: 
  // Same origin assets (HTML, CSS, JS, etc.) or Google Fonts/Unsplash Images
  const isSameOrigin = url.origin === self.location.origin;
  const isCdnResource = url.hostname.includes('fonts.googleapis.com') ||
                        url.hostname.includes('fonts.gstatic.com') ||
                        url.hostname.includes('images.unsplash.com');

  if (isSameOrigin || isCdnResource) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Construct the network request promise
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If we got a valid response, cache it!
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch((err) => {
          console.log('[ServiceWorker] Fetch failed; returning cached resource if available.', err);
        });

        // 1. If it's in the cache, return it immediately (0ms start) AND let the network fetch update the cache in the background
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. Otherwise, return the network fetch promise
        return fetchPromise || fetch(event.request);
      }).catch(() => {
        // Fallback for offline page request
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
    );
  }
});
