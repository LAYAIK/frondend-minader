// src/hooks/usePushNotifications.js
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// lecture de variables d'environnement
// When using Vite, environment variables are exposed through import.meta.env and should be prefixed with VITE_.
// e.g. VITE_API_URL and VITE_VAPID_PUBLIC_KEY in your .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function usePushNotifications() {
  const [swRegistration, setSwRegistration] = useState(null);
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready
        .then(reg => {
          setSwRegistration(reg);
          return reg.pushManager.getSubscription();
        })
        .then(subscription => {
          setIsSubscribed(!!subscription);
        })
        .catch(() => {
          setSwRegistration(null);
        });
    }
  }, []);

  const subscribe = useCallback(async ({ userId = null, room = null } = {}) => {
    if (!swRegistration) throw new Error('Service Worker non enregistré ou non prêt');
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p !== 'granted') throw new Error('Permission de notification refusée');

    const sub = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // envoyer la subscription au backend
    await axios.post(`${API_URL}/api/notifications/subscribe`, {
      subscription: sub,
      userId,
      room,
    });

    setIsSubscribed(true);
    return sub;
  }, [swRegistration]);

  const unsubscribe = useCallback(async ({ userId = null, room = null } = {}) => {
    if (!swRegistration) throw new Error('Service Worker non enregistré');
    const sub = await swRegistration.pushManager.getSubscription();
    if (sub) {
      try {
        await axios.post(`${API_URL}/api/notifications/unsubscribe`, {
          subscription: sub,
          userId,
          room
        });
      } catch (err) {
        console.warn('unsubscribe API error', err);
      }
      await sub.unsubscribe();
      setIsSubscribed(false);
    }
    return true;
  }, [swRegistration]);

  return {
    subscribe,
    unsubscribe,
    permission,
    isSubscribed,
    swRegistration,
  };
}
