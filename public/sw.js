/*
  Marquee service worker.
  Lightweight offline support for a marketing PWA:
   - Precache the app shell + a styled offline fallback on install.
   - Navigations: network-first, fall back to cache, then to /offline.
   - Static assets (Next build output, images, fonts): stale-while-revalidate.
  Bump CACHE_VERSION to invalidate old caches on deploy.
*/

const CACHE_VERSION = "marquee-v2";
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

// App shell + the curriculum index. Individual course units (.html) are cached
// on first visit by the network-first navigation handler below, so the whole
// curriculum becomes available offline as it's read.
const PRECACHE_URLS = [
  "/",
  "/work",
  "/contact",
  "/offline",
  "/manifest.webmanifest",
  "/courses.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) =>
        // Don't fail install if one URL 404s during dev.
        Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET; never cache API/mutations.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Page navigations: network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const network = await fetch(request);
          const cache = await caches.open(RUNTIME);
          cache.put(request, network.clone());
          return network;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match("/offline")) || Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  if (
    url.pathname.startsWith("/_next/") ||
    /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|ico|json)$/.test(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(RUNTIME).then((cache) => cache.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })(),
    );
  }
});
