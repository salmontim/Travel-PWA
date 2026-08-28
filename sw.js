/* Service Worker — Travel PWA 離線優先快取
   注意：每次修改 js/ 或 css/ 後，請遞增 VERSION，
   否則舊快取會讓使用者看到過期程式碼。 */
const VERSION = 'travel-pwa-v14';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './js/db.js',
  './js/firebase-config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 天氣與 Firestore API 不進快取，永遠直接走網路。
  if (url.hostname.includes('open-meteo.com')) {
    return; // 交由瀏覽器直接走網路
  }

  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firestore.googleapis.com')) {
    return;
  }

  // Firebase SDK CDN：先用快取，同時背景更新。
  if (url.hostname.includes('gstatic.com')) {
    e.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const cached = await cache.match(e.request);
        const fetched = fetch(e.request).then((res) => {
          cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetched;
      })
    );
    return;
  }

  // App 外殼：優先快取，沒有快取時才走網路。
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      });
    })
  );
});
