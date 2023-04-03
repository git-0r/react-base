self.addEventListener('install', event => {
  console.log('Installing service worker...');
});

self.addEventListener('activate', event => {
  console.log('Activating service worker...');
});

self.addEventListener('fetch', event => {
  console.log('Fetching...', event.request.url);
  event.respondWith(fetch(event.request));
});