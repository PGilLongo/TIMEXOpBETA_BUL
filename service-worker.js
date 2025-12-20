/* TIMEX PWA Service Worker (scope-safe: works in GitHub Pages or any subfolder) */
const CACHE_NAME = "timex-pwa-v4";

// Listado en rutas RELATIVAS al scope del Service Worker
const ASSETS = [
  "./",
  "./index.html",
  "./PDF TIMEX.html",
  "./NAVEGADOR.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

function abs(url) {
  return new URL(url, self.registration.scope).toString();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS.map(abs)))
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

  const url = new URL(req.url);

  // Solo gestionamos recursos dentro del mismo origen y dentro de nuestro scope
  if (url.origin !== self.location.origin) return;
  if (!url.href.startsWith(self.registration.scope)) return;

  // Navegación: si estás offline, devuelve index.html
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(abs("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      });
    })
  );
});
