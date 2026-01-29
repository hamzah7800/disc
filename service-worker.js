const CACHE = "discord-pwa-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/app.js",
  "./assets/styles.css",
  "./offline.html"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() => caches.match("./offline.html"));
    })
  );
});
