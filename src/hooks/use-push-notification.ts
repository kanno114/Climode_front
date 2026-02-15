"use client";

import { useState, useEffect, useCallback } from "react";
import {
  requestNotificationPermission,
  registerServiceWorker,
  isSubscribed as checkIsSubscribed,
  isNotificationSupported,
  urlBase64ToUint8Array,
} from "@/lib/push-notification";
import {
  subscribePushNotificationAction,
  unsubscribePushNotificationAction,
} from "@/app/(protected)/settings/notification-actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export function usePushNotification() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isNotificationSupported());

    checkIsSubscribed()
      .then(setIsSubscribed)
      .catch(() => setIsSubscribed(false))
      .finally(() => setIsLoading(false));
  }, []);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      const registration = await registerServiceWorker();
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
        });
      }

      const subscriptionJSON = subscription.toJSON();
      const result = await subscribePushNotificationAction({
        endpoint: subscriptionJSON.endpoint!,
        p256dh_key: subscriptionJSON.keys!.p256dh,
        auth_key: subscriptionJSON.keys!.auth,
      });

      if (result.status === "error") {
        throw new Error(result.error.message);
      }

      setIsSubscribed(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service workers are not supported");
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        return;
      }

      await subscription.unsubscribe();

      const result = await unsubscribePushNotificationAction(
        subscription.endpoint,
      );

      if (result.status === "error") {
        throw new Error(result.error.message);
      }

      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isSubscribed, isLoading, isSupported, subscribe, unsubscribe };
}
