import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

export const resolveNotificationUrl = (data = {}) => {
  if (!data) return "/contractor/home";

  if (data.url) return data.url;
  if (data.link) return data.link;
  if (data.click_action) return data.click_action;

  if (data.type === "chat" && data.projectId) {
    return `/contractor/project/${data.projectId}`;
  }
  // Context-based routing fallbacks
  if (data.type === "dpr" || data.reportId) {
    return `/contractor/view-report/${data.reportId}`;
  }
  if (data.type === "project" || data.projectId) {
    return `/contractor/project/${data.projectId}`;
  }
  if (data.type === "attendance" && data.projectId) {
    return `/contractor/projects/${data.projectId}/attendance`;
  }
  if (data.type === "inventory" && data.projectId) {
    return `/contractor/projects/${data.projectId}/inventory`;
  }
  if (data.type === "site-engineer-report" && data.projectId) {
    return `/site-engineer/projects/${data.projectId}/report`;
  }
  if (data.type === "site-engineer-project" && data.projectId) {
    return `/site-engineer/projects/${data.projectId}`;
  }

  return "/contractor/home";
};

export const onForegroundMessage = (callback) => {
  try {
    return onMessage(messaging, (payload) => {
      if (typeof callback === "function") {
        callback(payload);
      }
    });
  } catch (error) {
    console.error("Error setting up onMessage listener:", error);
    return () => {};
  }
};

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