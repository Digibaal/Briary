/* =============================================================
   Bonjour! — Frans voor onderweg
   sw.js — service worker voor volledig offline gebruik

   Strategie: bij de installatie gaan alle bestanden in de cache.
   Daarna wordt alles uit de cache geserveerd (dus meteen, ook
   zonder bereik) en tegelijk op de achtergrond ververst. Een
   wijziging is daardoor bij het eerstvolgende bezoek binnen en
   staat een bezoek later op het scherm — zonder dat je hier iets
   voor hoeft te doen.

   Er wordt nooit een externe host benaderd; de app heeft geen
   enkele afhankelijkheid buiten deze map.
   ============================================================= */

/* Hoog dit nummer op bij een wijziging: dan wordt de hele cache
   vervangen in plaats van bijgewerkt. Houd het gelijk aan
   APP_VERSIE in js/app.js. */
var VERSIE = 3;
var CACHE = 'bonjour-v' + VERSIE;

/* Relatieve paden, zodat de app in elke submap kan draaien. */
var BESTANDEN = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data.js',
  './js/illustraties.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      /* reload: haal ze bij de installatie gegarandeerd vers op,
         niet uit de gewone browsercache. */
      .then(function (cache) {
        return cache.addAll(BESTANDEN.map(function (pad) {
          return new Request(pad, { cache: 'reload' });
        }));
      })
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
    caches.open(CACHE).then(function (cache) {
      return cache.match(verzoek, { ignoreSearch: true }).then(function (uitCache) {

        /* Op de achtergrond verversen. Mislukt dit (offline), dan
           gebeurt er niets: de cache blijft gewoon staan. */
        var vers = fetch(verzoek).then(function (antwoord) {
          if (antwoord && antwoord.status === 200 && antwoord.type === 'basic') {
            cache.put(verzoek, antwoord.clone());
          }
          return antwoord;
        }).catch(function () {
          return null;
        });

        if (uitCache) return uitCache;

        return vers.then(function (antwoord) {
          if (antwoord) return antwoord;
          /* Offline en niet in de cache: paginaverzoeken terug naar de app. */
          if (verzoek.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'Offline' });
        });
      });
    })
  );
});

/* De pagina kan vragen om meteen over te schakelen na een update. */
self.addEventListener('message', function (e) {
  if (e.data === 'neem-over') self.skipWaiting();
});
