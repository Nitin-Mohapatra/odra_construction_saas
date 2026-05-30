import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import axiosInstance from "./axiosInstance";

export const registerFCM = async () => {

  try {

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {
      return;
    }

    const token = await getToken(
      messaging,
      {
        vapidKey:
          import.meta.env.VITE_FIREBASE_VAPID_KEY
      }
    );

    if (!token) return;

    await axiosInstance.post(
      "/notification/save-token",
      { token }
    );

    console.log("FCM token saved");

  } catch (error) {

    console.error(
      "FCM registration error",
      error
    );

  }

};