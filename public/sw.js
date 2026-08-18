/**
 * Service Worker — PWA offline support.
 *
 * Cache strategy (v3):
 * - Navigation requests (HTML): NETWORK-FIRST — always fetch latest
 *   index.html from server, so new deploys take effect immediately
 *   without manual hard-refresh. Falls back to cached HTML offline.
 * - Static assets (JS/CSS/images): STALE-WHILE-REVALIDATE — serve from
 *   cache instantly (hashed filenames change per build → auto-miss → refetch).
 *
 * Versioned cache name: bump `VERSION` on breaking cache-format changes;
 * activate() purges all caches from previous versions.
 */
const VERSION = 'tcb-v3'
const CORE_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg', '/robots.txt', '/sitemap.xml']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e

  // HTML / navigation: network-first with offline fallback
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone()
          caches.open(VERSION).then(c => c.put(request, copy))
          return res
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    )
    return
  }

  // Static assets: stale-while-revalidate (cache-first + background refresh)
  e.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(VERSION).then(c => c.put(request, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
