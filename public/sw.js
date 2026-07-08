const CACHE = 'tcb-v1'
const ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg', '/robots.txt', '/sitemap.xml']
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))))
  self.clients.claim()
})
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const c = caches.open(CACHE).then(cache => { cache.put(e.request, res.clone()); return res })
      return c
    }))
  )
})
