// Service Worker para Galleta de la Suerte
const CACHE_NAME = 'galleta-suerte-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/data/frases.json',
  '/data/zodiaco.json',
  '/themes/oriental.css',
  '/themes/navidad.css',
  '/themes/halloween.css',
  '/themes/valentine.css'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error al cachear archivos:', err))
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antiguo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver del caché si existe
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacer fetch
        return fetch(event.request)
          .then(response => {
            // Verificar si es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta
            const responseToCache = response.clone();
            
            // Agregar al caché
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(err => {
            console.log('Error en fetch:', err);
            // Aquí podrías devolver una página offline personalizada
          });
      })
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificación push cuando la galleta se desbloquea
self.addEventListener('push', event => {
  const options = {
    body: '¡Tu galleta de la suerte está lista! Ábrela ahora.',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'fortune-cookie-ready',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Abrir Galleta'
      },
      {
        action: 'close',
        title: 'Más tarde'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('🥠 Galleta de la Suerte', options)
  );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
