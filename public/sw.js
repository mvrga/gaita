/* global self, caches, fetch */

const gaitaCacheName = "gaita-static-assets-v1";
const gaitaStaticAssets = [
  "/",
  "/manifest.json",
  "/icons/gaita-icon-192.svg",
  "/icons/gaita-icon-512.svg"
];

async function cacheStaticAssets() {
  const gaitaStaticCache = await caches.open(gaitaCacheName);
  await gaitaStaticCache.addAll(gaitaStaticAssets);
}

async function fetchWithNetworkFallback(fetchRequest) {
  try {
    const networkResponse = await fetch(fetchRequest);
    const gaitaRuntimeCache = await caches.open(gaitaCacheName);
    await gaitaRuntimeCache.put(fetchRequest, networkResponse.clone());
    return networkResponse;
  } catch (networkError) {
    const cachedResponse = await caches.match(fetchRequest);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw networkError;
  }
}

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (fetchEvent) => {
  if (fetchEvent.request.method !== "GET") {
    return;
  }

  fetchEvent.respondWith(fetchWithNetworkFallback(fetchEvent.request));
});
