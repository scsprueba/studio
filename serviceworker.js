
// This is a basic service worker file that allows the PWA to be installable.
// You can add more complex caching strategies here if needed.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // No specific assets to pre-cache in this simple setup.
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Clean up old caches if necessary.
});

self.addEventListener('fetch', (event) => {
  // This service worker doesn't intercept fetch requests.
  // It's just here to make the app installable.
  return;
});
