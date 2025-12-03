const CACHE_NAME = 'strength-os-v13';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

// 1. INSTALL: Force immediate activation
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Don't wait for the old SW to die
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 2. ACTIVATE: Delete old caches & take control
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
        .then(() => self.clients.claim()) // Immediate control for open clients
    );
});

// 3. FETCH: Serve from Cache
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
