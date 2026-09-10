/* =============================================================
   Bonjour! — Frans voor onderweg
   sw.js — service worker voor volledig offline gebruik

   Strategie: alle bestanden worden bij de installatie in de cache
   gezet (precache). Daarna wordt alles uit de cache geserveerd.
   Er wordt nooit een externe host benaderd — de app heeft geen
   enkele afhankelijkheid buiten deze map.
   ============================================================= */

var CACHE = 'bonjour-v1';

/* Relatieve paden, zodat de app in elke submap kan draaien. */
var BESTANDEN = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(BESTANDEN); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (namen) {
        return Promise.all(namen.map(function (naam) {
          if (naam !== CACHE) return caches.delete(naam);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var verzoek = e.request;

  /* Alleen gewone GET-verzoeken binnen de eigen oorsprong. */
  if (verzoek.method !== 'GET') return;
  if (new URL(verzoek.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(verzoek, { ignoreSearch: true }).then(function (uitCache) {
      if (uitCache) return uitCache;

      return fetch(verzoek).then(function (antwoord) {
        /* Nieuw opgehaalde bestanden meteen bewaren voor de volgende keer. */
        if (antwoord && antwoord.status === 200 && antwoord.type === 'basic') {
          var kopie = antwoord.clone();
          caches.open(CACHE).then(function (cache) { cache.put(verzoek, kopie); });
        }
        return antwoord;
      }).catch(function () {
        /* Offline en niet in de cache: voor paginaverzoeken terug naar de app. */
        if (verzoek.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
