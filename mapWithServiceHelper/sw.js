// Service Worker Cache
//
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open('pwa-cache')
            .then(cache => cache.match(event.request))
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('install', event => {
    console.log("HelloTest1")
    event.waitUntil(
        caches.open('pwa-cache')
            .then(cache => cache.addAll([
                './',
                'index.html',
                'mapWithServiceHelper/sw.js',
                'mapWithServiceHelper/leaflet.css',
                'mapWithServiceHelper/leaflet.js',
                'mapWithServiceHelper/images/layers.png',
                'mapWithServiceHelper/images/layers-2x.png',
                'mapWithServiceHelper/images/marker-icon-2x.png',
                'mapWithServiceHelper/images/marker-shadow.png',
                'mapWithServiceHelper/images/marker-icon.png',
                'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'http://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png',



            ]))
            .then(() => self.skipWaiting())
    );
});


// siehe auch: https://developer.mozilla.org/de/docs/Web/API/Service_Worker_API/Using_Service_Workers
