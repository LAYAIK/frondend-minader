// src/hooks/useNotifications.js
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  // Écouter les notifs socket.io
  useEffect(() => {
    if (!userId) return;

    const s = io("http://localhost:3003", {
      query: { userId },
      transports: ["websocket"], // force WebSocket
    });

    s.on("connect", () => console.log("🔌 Socket connected", s.id));
    s.on("newNotification", ({ notif }) => {
      console.log("📩 Reçu notif via socket:", notif);
      setNotifications((prev) => [notif, ...prev]);
    });
    return () => {
      s.disconnect();
    };
  }, [userId]);

  // Abonner au push Web (via Service Worker)
  const subscribeToPush = useCallback(async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push API non supporté dans ce navigateur");
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ SW enregistré:", reg);

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
      });

      // envoyer la souscription au backend

          await axios.post("http://localhost:3003/api/notifications/subscribe", {
            subscription: sub,
            userId
          });

      console.log("🔔 Utilisateur abonné aux push");
    } catch (err) {
      console.error("Erreur abonnement push:", err);
    }
  }, [userId]);

  return { notifications, subscribeToPush };
}

// helper pour transformer la clé VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
