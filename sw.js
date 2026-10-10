const CACHE = 'mdj-202610101431';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'fonts/fonts.css', 'fonts/manrope-400-800-cyrillic-ext.woff2', 'fonts/manrope-400-800-cyrillic.woff2', 'fonts/manrope-400-800-latin-ext.woff2', 'fonts/manrope-400-800-latin.woff2', 'fonts/shippori-500-latin-ext.woff2', 'fonts/shippori-500-latin.woff2', 'fonts/shippori-600-latin-ext.woff2', 'fonts/shippori-600-latin.woff2', 'fonts/shippori-700-latin-ext.woff2', 'fonts/shippori-700-latin.woff2', 'fonts/shippori-800-latin-ext.woff2', 'fonts/shippori-800-latin.woff2', 'fonts/noto-serif-500-800-cyrillic.woff2', 'fonts/noto-serif-500-800-latin.woff2', 'fonts/socle-700-1.woff2', 'fonts/socle-700-plus1-1.woff2', 'fonts/socle-700-plus2-1.woff2', 'fonts/socle-800-1.woff2', 'fonts/socle-800-plus1-1.woff2', 'fonts/socle-800-plus2-1.woff2', 'fonts/pinceau-1.woff2', 'fonts/langues-sc-1.woff2', 'fonts/langues-kr-1.woff2', 'fonts/symboles-manrope-1.woff2', 'fonts/symboles-noto-sans-symbols-2-1.woff2', 'fonts/symboles-noto-sans-symbols-2-plus1-1.woff2', 'fonts/symboles-noto-sans-symbols-2-plus2-1.woff2', 'fonts/symboles-noto-sans-symbols-2-plus3-1.woff2', 'fonts/symboles-noto-sans-math-1.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && (req.mode === 'navigate' || url.pathname.endsWith('/index.html'))) {
    // la page : réseau d'abord, revérifiée auprès du serveur (GitHub Pages la laisse 10 min dans le cache HTTP), cache si hors connexion
    e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(r => { if (!r.ok) return r; const cp = r.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
  } else if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })));
  }
});
