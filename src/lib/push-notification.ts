// Push Notification Library for subscribing and unsubscribing to push notifications

// VAPID public key - should be set from environment variable
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

// Convert base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Request notification permission from the user
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }

  const permission = await Notification.requestPermission();
  return permission;
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  console.log("Service Worker registered:", registration);

  // Wait for the service worker to be ready
  await navigator.serviceWorker.ready;

  return registration;
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(
  token: string
): Promise<PushSubscription | null> {
  try {
    // Check if notifications are supported
    if (!isNotificationSupported()) {
      throw new Error("Push notifications are not supported");
    }

    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    // Register service worker
    const registration = await registerServiceWorker();

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log("Already subscribed:", subscription);
      return subscription;
    }

    // Subscribe to push notifications
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    console.log("Push subscription:", subscription);

    // Send subscription to backend
    await sendSubscriptionToBackend(subscription, token);

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    throw error;
  }
}

// Send subscription to backend
async function sendSubscriptionToBackend(
  subscription: PushSubscription,
  token: string
): Promise<void> {
  const subscriptionJSON = subscription.toJSON();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/push_subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subscription: {
          endpoint: subscriptionJSON.endpoint,
          p256dh_key: subscriptionJSON.keys?.p256dh,
          auth_key: subscriptionJSON.keys?.auth,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors || "Failed to save subscription");
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(
  token: string
): Promise<void> {
  try {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported");
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("No subscription found");
      return;
    }

    // Unsubscribe from browser
    await subscription.unsubscribe();
    console.log("Unsubscribed from push notifications");

    // Delete subscription from backend
    await deleteSubscriptionFromBackend(subscription.endpoint, token);
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    throw error;
  }
}

// Delete subscription from backend
async function deleteSubscriptionFromBackend(
  endpoint: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/push_subscriptions/by_endpoint`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete subscription");
  }
}

// Check if user is currently subscribed
export async function isSubscribed(): Promise<boolean> {
  try {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}

// Get current subscription
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  try {
    if (!("serviceWorker" in navigator)) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("Error getting current subscription:", error);
    return null;
  }
}
