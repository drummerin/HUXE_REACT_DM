/**
 * Created by Sophie on 06.07.2017.
 */

const CACHE_NAME = 'plan_it_cache';
const urlsToCache = [
  '/',
  '/projects',
  '/assets/logo.png',
  'bundle.js',
  'index.html',
  '404.html',
  '/src/projects.js',
  '/src/styles.css',
  'http://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css',
  'https://fonts.googleapis.com/css?family=Asap|Roboto',
  'https://fonts.gstatic.com/s/asap/v5/oiVlPAjaPL0EznW3E5Z2DQ.woff2',
  'http://c.tile.osm.org/14/8852/5670.png',
  'http://a.tile.osm.org/14/8853/5670.png',
  'http://c.tile.osm.org/14/8853/5669.png',
  'http://b.tile.osm.org/14/8852/5669.png',
];

const OFFLINE_URL = '404.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
               console.log('Opened cache');
               cache.addAll(urlsToCache);
            }),
    );
});

console.log('cached resources:', urlsToCache);

// Delete old caches that are not our current one!
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.log('Deleting cache: ' + key)
                        return caches.delete(key);
                    }
                }))
            )
    );
});


 self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    // Parse the URL:
    const requestURL = new URL(event.request.url);
    console.log(requestURL.hostname);

    if(event.request.url.toString().search('www.google.de') === -1 ) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                console.log(event.request);
                if (response) {
                    console.log(response);
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request).then(function (response) {
                    console.log('Response from network is:', response);
                    return response;
                })
            }).catch(function (error) {
                console.log('error while fetching..');
                return new Response("Hello world!");
            })
        );
    }
});
/*
self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    const dataUrl = 'https://planit-e2048.firebaseio.com/';
    if (e.request.url.indexOf(dataUrl) === 0) {
        e.respondWith(
            fetch(e.request)
                .then(function(response) {
                    return caches.open(dataCacheName).then(function(cache) {
                        cache.put(e.request.url, response.clone());
                        console.log('[ServiceWorker] Fetched&Cached Data');
                        return response;
                    });
                })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});*/






