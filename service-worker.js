/* TIMEX PWA Service Worker (GitHub Pages scope-safe) */
const CACHE_NAME = "timex-pwa-v3";

const FILES_TO_CACHE = [
  "/timex/",
  "/timex/index.html",
  "/timex/PDF%20TIMEX.html",
  "/timex/NAVEGADOR.html",
  "/timex/manifest.json",
  "/timex/icons/icon-192.png",
  "/timex/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        try {
          const url = new URL(req.url);
          if (url.origin === self.location.origin && url.pathname.startsWith("/timex/")) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
        } catch {}
        return res;
      });
    })
  );
});
