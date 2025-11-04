// Define cache names. A new version will clear old caches.
const STATIC_CACHE_NAME = 'flowpay-static-cache-v1';
const DATA_CACHE_NAME = 'flowpay-data-cache-v1';
const API_URL_PART = '/api/'; // A string to identify API calls

// List of essential assets to be pre-cached.
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://unpkg.com/clsx@1.2.1/dist/clsx.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf-autotable.min.js',
  'https://aistudiocdn.com/recharts@^3.3.0',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react@^19.2.0/jsx-runtime',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/lucide-react@^0.552.0',
  'https://aistudiocdn.com/react-router-dom@^6.25.1',
];

// Install event: Cache static assets.
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        // Use addAll with a catch to prevent installation failure if one asset fails.
        // Removed `no-cors` as it's not suitable for these CDN assets which support CORS.
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.error('[SW] Failed to precache some static assets:', error);
        });
      })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches.
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  const cacheWhitelist = [STATIC_CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: Apply caching strategies.
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extension requests
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Strategy 1: API calls (Network First, then Cache)
  // This ensures data is fresh but available offline.
  if (url.pathname.startsWith(API_URL_PART)) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Check if we received a valid response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DATA_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log(`[SW] Network failed for API call: ${request.url}. Serving from cache.`);
          // If network fails, try to serve from cache.
          return caches.match(request).then(response => {
            return response || new Response(JSON.stringify({ error: "Offline: Could not fetch data." }), { headers: { 'Content-Type': 'application/json' }});
          });
        })
    );
    return;
  }

  // Strategy 2: Static Assets (Cache First, then Network)
  // Ideal for app shell, fonts, scripts, and styles.
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return from cache if found.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network, cache, and return.
        return fetch(request).then(networkResponse => {
           if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(error => {
            console.error('[SW] Fetch failed for static asset:', request.url, error);
            // Optionally, return a fallback page/asset here
        });
      })
  );
});