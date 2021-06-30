self.addEventListener('install', e => {
  e.waitUntil(caches.open('static').then(cache => {
    return cache.addAll([
      '/favicon.ico',
      '/icon.png',
      '/javascript/chat.js',
      '/javascript/peer.js',
      '/javascript/stream.js',
      '/javascript/viewer.js',
      '/font/v.eot',
      '/font/v.svg',
      '/font/v.ttf',
      '/font/v.woff',
      '/font/v.woff2',
      '/stylesheets/main.css',
      '/stylesheets/fonts.css',
      '/stylesheets/bulma/css/bulma.min.css'
    ])
  }))
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});