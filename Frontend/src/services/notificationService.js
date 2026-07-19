import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Generating a unique token for this browser
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    // if Firebase fails to generate the token.
    if (!currentToken) {
      console.log("No FCM token available");
      return null;
    }

    return currentToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};