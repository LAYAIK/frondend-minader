// // public/sw.js
// self.addEventListener('push', function (event) {
//   let data = {};
//   try {
//     data = event.data ? event.data.json() : {};
//   } catch (e) {
//     data = { title: 'Nouveau', body: event.data?.text() || '' };
//     console.error('Push event data is not JSON:', e);
//   }

//   const title = data.title || 'Notification';
//   const options = {
//     body: data.body || '',
//     tag: data.tag || undefined,
//     data: {
//       url: data.url || '/',  // url to open on click
//       meta: data.meta || {}
//     },
//     renotify: true,
//     // icon: '/icons/192.png' // optional icon
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close();
//   const targetUrl = event.notification.data?.url || '/';
//   event.waitUntil(
//     self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
//       for (const client of clientList) {
//         // If there is a client with the URL already open, focus it
//         if (client.url.includes(targetUrl) && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       if (self.clients && typeof self.clients.openWindow === 'function') {
//         return self.clients.openWindow(targetUrl);
//       }
//       return Promise.resolve();
//     })
//   );
// });



/* eslint-disable no-undef */

// Quand un push est reçu (même si l'appli est fermée)
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Nouvelle notification";
  const options = {
    body: data.body,
    data: { url: data.url || "/" }, // utilisé au clic
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    tag: data.tag || "general",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Quand l'utilisateur clique sur la notif
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          client.navigate(event.notification.data.url || "/");
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "/");
      }
    })
  );
});

