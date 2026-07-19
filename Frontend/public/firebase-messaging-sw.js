importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB5o_fMwe4zx5JW75lTSXLH58_0pA4Mdv8",
  authDomain: "odraopssaas.firebaseapp.com",
  projectId: "odraopssaas",
  storageBucket: "odraopssaas.firebasestorage.app",
  messagingSenderId: "1058597575369",
  appId: "1:1058597575369:web:b4bf6e1cf0c1d041524b18",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon/icon-192x192.png",
  });
});