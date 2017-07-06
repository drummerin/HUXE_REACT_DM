/**
 * Created by Sophie on 06.07.2017.
 */

const CACHE_NAME = 'plan_it_cache';
let CACHE_VERSION = 1;
const urlsToCache = [
  '/',
  '/projects',
  '/assets/logo.png',
  'bundle.js',
  /* '/src/projects.js',
  '/src/styles.css',
  'http://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css',
  'https://fonts.googleapis.com/css?family=Asap|Roboto',*/
];

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

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log(event.request);
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request);
        }).catch(function(error) {
            console.log('error while fetching..')

        })
    );
});







