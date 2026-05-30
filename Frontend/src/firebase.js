import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDxrTtEzWuY5uDNqgNUYKbw3gK6JXAzkx4",
  authDomain: "odraops-saas.firebaseapp.com",
  projectId: "odraops-saas",
  storageBucket: "odraops-saas.firebasestorage.app",
  messagingSenderId: "401541401079",
  appId: "1:401541401079:web:0b119e95f765f2e9af06f2"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);