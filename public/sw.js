const CACHE_NAME = 'joharsetu-v2.0';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/portal/citizen',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-first caching strategy with offline fallback
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  // Do not cache Next.js dynamic API routes
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid HTTP 200 responses from our origin
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Background Sync listener for queued citizen reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-reports') {
    event.waitUntil(syncOfflineReports());
  }
});

async function syncOfflineReports() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('offline_reports', 'readwrite');
    const store = tx.objectStore('offline_reports');
    const reports = await store.getAll();

    for (const report of reports) {
      try {
        const response = await fetch('/api/tickets/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });

        if (response.ok) {
          await store.delete(report.id);
          if (self.registration && self.registration.showNotification) {
            self.registration.showNotification('JoharSetu Sync Completed', {
              body: `Your report "${report.title}" has been uploaded successfully!`,
              icon: '/icons/icon-192.png',
            });
          }
        }
      } catch (err) {
        console.error('Sync item failed, will retry on next reconnect:', err);
      }
    }
  } catch (err) {
    console.error('Failed to access offline database:', err);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('JoharSetu_OfflineStore', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('offline_reports')) {
        db.createObjectStore('offline_reports', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
