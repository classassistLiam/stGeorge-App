
/* ==========================================================
   ST. GEORGE YOUTH — PROGRESSIVE WEB APP SERVICE WORKER
   Cross-platform • Offline support • Update management
========================================================== */

'use strict';

const SW_VERSION = 'v2.0.0';

const CACHE_PREFIX = 'st-george-youth-';
const CACHE_NAME = `${CACHE_PREFIX}${SW_VERSION}`;

const OFFLINE_PAGE = './index.html';

/*
  Core files required for the application shell.

  If one file is missing, installation will still proceed
  with the files that are available.
*/

const CORE_FILES = [
  './',
  './index.html',
  './page1.html',
  './page2.html',
  './page3.html',

  './manifest.json',

  './css/styles.css',
  './js/app.js',

  './assets/icon.svg',

  './management-original.html',
  './community-original.html',
  './snake-original.html',
  './racing-original.html'
];

/* ==========================================================
   INSTALL
========================================================== */

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(async cache => {

        const results = await Promise.allSettled(

          CORE_FILES.map(async file => {

            try {

              const response = await fetch(file, {
                cache: 'reload'
              });

              if (
                response.ok &&
                response.type === 'basic'
              ) {

                await cache.put(file, response);

              }

            } catch (error) {

              console.warn(
                '[St George PWA] Could not cache:',
                file
              );

            }

          })

        );

        console.info(
          '[St George PWA] Application shell cached.'
        );

      })

      .then(() => self.skipWaiting())

  );

});


/* ==========================================================
   ACTIVATE
========================================================== */

self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys()

      .then(cacheNames => {

        return Promise.all(

          cacheNames.map(cacheName => {

            /*
              Only remove caches belonging to THIS app.
              Do not delete caches belonging to unrelated apps.
            */

            if (
              cacheName.startsWith(CACHE_PREFIX) &&
              cacheName !== CACHE_NAME
            ) {

              return caches.delete(cacheName);

            }

          })

        );

      })

      .then(() => self.clients.claim())

      .then(() => {

        console.info(
          '[St George PWA] Service worker activated:',
          SW_VERSION
        );

      })

  );

});


/* ==========================================================
   HELPERS
========================================================== */

function isSameOrigin(request) {

  return new URL(request.url).origin === self.location.origin;

}


function isNavigation(request) {

  return request.mode === 'navigate';

}


function isCacheable(response) {

  return (
    response &&
    response.ok &&
    response.status === 200 &&
    response.type === 'basic'
  );

}


function isSensitiveRequest(request) {

  const url = new URL(request.url);

  /*
    Avoid caching authentication, admin, API and
    dynamic/private endpoint responses.
  */

  const excludedPaths = [
    '/api/',
    '/auth/',
    '/login',
    '/logout',
    '/admin/',
    '/private/',
    '/firebase/',
    '/functions/'
  ];

  return excludedPaths.some(path =>
    url.pathname.includes(path)
  );

}


/* ==========================================================
   NETWORK-FIRST: HTML NAVIGATION
========================================================== */

async function handleNavigation(request) {

  try {

    const networkResponse = await fetch(request);

    if (isCacheable(networkResponse)) {

      const cache = await caches.open(CACHE_NAME);

      await cache.put(request, networkResponse.clone());

    }

    return networkResponse;

  } catch (error) {

    /*
      Offline fallback:
      First try the exact requested page.
      Then fall back to the application homepage.
    */

    const cachedPage = await caches.match(request);

    if (cachedPage) {

      return cachedPage;

    }

    const offlinePage = await caches.match(OFFLINE_PAGE);

    if (offlinePage) {

      return offlinePage;

    }

    return new Response(

      `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"
                content="width=device-width, initial-scale=1">
          <title>St George Youth</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              background: #f6f9f5;
              color: #17251d;
              min-height: 100vh;
              display: grid;
              place-items: center;
              text-align: center;
              padding: 24px;
            }

            main {
              max-width: 420px;
              background: white;
              padding: 32px;
              border-radius: 24px;
            }

            h1 {
              color: #176b38;
            }
          </style>
        </head>

        <body>
          <main>
            <h1>You're offline</h1>
            <p>
              St George Youth needs an internet connection
              to load this page for the first time.
            </p>
            <p>
              Reconnect and try again.
            </p>
          </main>
        </body>
        </html>
      `,

      {
        status: 503,
        headers: {
          'Content-Type': 'text/html;charset=utf-8'
        }

      }

    );

  }

}


/* ==========================================================
   CACHE-FIRST: STATIC ASSETS
========================================================== */

async function handleAsset(request) {

  const cachedResponse = await caches.match(request);

  if (cachedResponse) {

    /*
      Return cached asset immediately.
      Refresh cache in background when possible.
    */

    fetch(request)

      .then(async response => {

        if (isCacheable(response)) {

          const cache = await caches.open(CACHE_NAME);

          await cache.put(request, response.clone());

        }

      })

      .catch(() => {});

    return cachedResponse;

  }


  try {

    const networkResponse = await fetch(request);

    if (isCacheable(networkResponse)) {

      const cache = await caches.open(CACHE_NAME);

      await cache.put(request, networkResponse.clone());

    }

    return networkResponse;

  } catch (error) {

    return new Response(

      'Offline resource unavailable.',

      {
        status: 503,
        statusText: 'Service Unavailable'
      }

    );

  }

}


/* ==========================================================
   FETCH HANDLER
========================================================== */

self.addEventListener('fetch', event => {

  const request = event.request;

  /*
    Ignore:
    - POST, PUT, DELETE and other non-GET requests
    - Cross-origin requests
    - Sensitive application endpoints
  */

  if (request.method !== 'GET') return;

  if (!isSameOrigin(request)) return;

  if (isSensitiveRequest(request)) return;


  /*
    HTML pages use network-first.
    This ensures users receive updated pages when online.
  */

  if (isNavigation(request)) {

    event.respondWith(

      handleNavigation(request)

    );

    return;

  }


  /*
    Static files use cache-first with background refresh.
  */

  event.respondWith(

    handleAsset(request)

  );

});


/* ==========================================================
   MESSAGE HANDLER
========================================================== */

self.addEventListener('message', event => {

  if (!event.data) return;


  /*
    Allow the application to request an update activation.
  */

  if (event.data.type === 'SKIP_WAITING') {

    self.skipWaiting();

  }


  /*
    Return current worker version to the application.
  */

  if (event.data.type === 'GET_VERSION') {

    event.ports?.[0]?.postMessage({

      version: SW_VERSION

    });

  }

});


/* ==========================================================
   END
========================================================== */
