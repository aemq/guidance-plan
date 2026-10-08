// Service worker for the guidance-plan app.
// It lets the browser offer one-tap install, and keeps the app opening without internet.
// Network first: a new version is used as soon as there is a connection.
const CACHE = 'guidance-plan-v1';
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function(res){
      if (res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){ return hit || caches.match('./index.html'); });
    })
  );
});
