importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
   apiKey: "AIzaSyDxrTtEzWuY5uDNqgNUYKbw3gK6JXAzkx4",
  authDomain: "odraops-saas.firebaseapp.com",
  projectId: "odraops-saas",
  storageBucket: "odraops-saas.firebasestorage.app",
  messagingSenderId: "401541401079",
  appId: "1:401541401079:web:0b119e95f765f2e9af06f2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon/lg-mb-192.png"
    }
  );

});