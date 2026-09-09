// Service Worker de Pluma Libre — endurecido en pl-v9.
// - Navegaciones (HTML): network-first con fallback a cache y HTML mínimo "Sin conexión".
//   NUNCA undefined → nunca pantalla "Esta página web no funciona temporalmente".
// - Assets mismo-origen: stale-while-revalidate; fallback a Response 504.
// - banners.json: red directa, sin cache (siempre fresco).
// - Otros orígenes (fonts, Google Analytics, etc.): sin interceptar.
// - Actualización inmediata: instala la versión nueva y toma control sin esperar
//   a que el lector cierre todas las pestañas.

const CACHE_VERSION = 'pl-v41';
const SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.webmanifest',
  '/assets/install.js',
  '/assets/logo-simbolo.png',
  '/assets/logo-wordmark.png',
  '/assets/favicon-192x192.png',
  '/assets/icon-512.png'
];

const OFFLINE_HTML = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexión — Pluma Libre</title><style>body{font-family:-apple-system,system-ui,"Outfit",sans-serif;background:#F5F5F7;color:#1D1D1F;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center}h1{font-size:1.5rem;margin:0 0 12px;color:#081A41}p{max-width:380px;line-height:1.5;color:#6E6E73}button{margin-top:24px;padding:12px 24px;border-radius:100px;border:none;background:#0071E3;color:#fff;font-size:1rem;font-weight:600;cursor:pointer}</style></head><body><h1>Sin conexión</h1><p>No se pudo cargar la página. Verificá tu conexión a internet e intentá de nuevo.</p><button onclick="location.reload()">Reintentar</button></body></html>';

self.addEventListener('install', (e) => {
  // allSettled: un 404 en un asset NO tumba toda la instalación.
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((c) => Promise.allSettled(SHELL.map((url) => c.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Otros orígenes: red directa. No interceptamos.
  if (url.origin !== self.location.origin) return;

  // Configuracion siempre fresca — no cachear. Si se cachea, editar el archivo
  // no cambia nada hasta que caduque y parece que la edicion no sirvio.
  if (url.pathname === '/banners.json' || url.pathname === '/menu.json') return;

  const accept = req.headers.get('accept') || '';
  const isNavigation = req.mode === 'navigate' || accept.includes('text/html');

  if (isNavigation) {
    e.respondWith(networkFirstHTML(req));
  } else {
    e.respondWith(staleWhileRevalidate(req));
  }
});

async function networkFirstHTML(req) {
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
    }
    return res;
  } catch (_) {
    const cached = await caches.match(req);
    if (cached) return cached;
    const index = await caches.match('/index.html');
    if (index) return index;
    return new Response(OFFLINE_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);
  const fresh = fetch(req).then((res) => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
    }
    return res;
  }).catch(() => null);

  if (cached) return cached;
  const net = await fresh;
  if (net) return net;
  return new Response('', { status: 504, statusText: 'offline' });
}
