var CACHE_NAME = 'edp-snobella-v1';
var urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  '/favicon.svg',
  '/offline.html'
];

/* Install — cache core assets */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

/* Fetch — network first, fallback to cache */
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).then(function (response) {
      var responseToCache = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(event.request, responseToCache);
      });
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (response) {
        return response || caches.match('/offline.html');
      });
    })
  );
});

/* Activate — clean old caches */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (name) {
          return name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    })
  );
});
