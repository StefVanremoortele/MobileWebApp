/**
 * Created by clydez on 23/03/2017.
 */

var cacheName = "offlineVersion 1.6";
var cacheFiles = [
    "./",
    "./css/reset.css",
    "./css/style.css",
    "./js/app.js",
    "./index.html",
    "./test.html"
];


self.addEventListener("install", function(e){
    console.log("[ServiceWorker} installed");

    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log("[ServiceWorker] caching cacheFiles");
            return cache.addAll(cacheFiles);
        }).then(function(){
            // `skipWaiting()` forces the waiting ServiceWorker to become the
            // active ServiceWorker, triggering the `onactivate` event.
            // Together with `Clients.claim()` this allows a worker to take effect
            // immediately in the client(s).
            return self.skipWaiting();
        })
    )
});

self.addEventListener("activate", function(e){
    console.log("[ServiceWorker} activated");
    e.waitUntil(
        caches.keys().then(function(names){
            Promise.all(
                names.filter(function(name) {
                    return name !== cacheName;
                }).map(function(name) {
                    return caches.delete(name);
                })
            )
        })
    )
});

self.addEventListener("fetch", function(event){
    event.respondWith(caches.match(event.request).then(function(response){
        console.log(event.request.url);
        if(response)
            return response;
        return fetch(event.request).then(function (response) {

            return response;
        })
    }))
});

// this doesn't seem to work: even when no matches found, the promise is true, so we never go online for recourse
/*
self.addEventListener("fetch", function(e){
    console.log("[ServiceWorker} Fetching", e.request.url);
    e.respondWith(
        caches.open(cacheName).then(function(cache){
            return cache.match(e.request);
        })
    )
});*/
