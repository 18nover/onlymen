/* OnlyMen service worker: caches the APP SHELL ONLY.
 * - Cached: hashed build assets (/assets/*), icons, the manifest, the offline page, the map style.
 * - Never cached: page HTML (it can carry signed-in data and must always pass the 18+ and
 *   private-mode gates on the server), /api/*, server functions, member or demo photos,
 *   map tiles, and anything that isn't a same-origin GET. Those go straight to the network
 *   and the browser's normal HTTP cache.
 */
const VERSION = "om-shell-v2";
const PRECACHE = ["/offline", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/map/noir-gold-v2.json"];
const SHELL = (u) => u.pathname.startsWith("/assets/") || u.pathname.startsWith("/icons/") || PRECACHE.includes(u.pathname);

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    // network only; fall back to a static offline page (no cached HTML, so gates always run)
    e.respondWith(fetch(req).catch(() => caches.match("/offline")));
    return;
  }
  if (!SHELL(url)) return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === "basic") { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    })),
  );
});
