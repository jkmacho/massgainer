// Service worker del diario: funciona sin conexión.
// Al publicar una versión nueva, subir VERSION para que el móvil la recoja.
const VERSION = 'v4';
const CACHE = 'diario-eric-' + VERSION;
const SHELL = ['./', 'index.html', 'ejercicios.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

// Fotos de los ejercicios: la lista sale de ejercicios.js (define window.EXLIB)
self.window = self;
try { importScripts('ejercicios.js'); } catch (e) {}
const IMGS = (self.EXLIB || []).flatMap(x => Array.from({ length: x.img || 0 }, (_, i) => 'ex/' + encodeURIComponent(x.id) + '-' + i + '.jpg'));

// Se descargan por detrás, de 6 en 6, cuando la página lo pide; las que ya están no se repiten
async function precacheImages(){
  const c = await caches.open(CACHE);
  for (let i = 0; i < IMGS.length; i += 6) {
    await Promise.all(IMGS.slice(i, i + 6).map(async u => {
      if (await c.match(u)) return;
      try { const r = await fetch(u); if (r.ok) await c.put(u, r); } catch (e) {}
    }));
  }
}
self.addEventListener('message', e => { if (e.data === 'precache') e.waitUntil(precacheImages()); });

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('diario-eric-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // La página: primero la red (así llegan las versiones nuevas), sin conexión la guardada
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }

  // Resto (iconos, fuentes, librería de Excel): lo guardado y se refresca por detrás
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
