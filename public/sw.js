// Service Worker for Push Notifications

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

// Push event - triggered when a push notification is received
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  let data = {};

  if (event.data) {
    try {
      // Try to parse as JSON
      data = event.data.json();
      console.log("Push data parsed as JSON:", data);
    } catch (e) {
      // If JSON parse fails, try to use as plain text
      const textData = event.data.text();
      console.warn(
        "Push data is not valid JSON, using as plain text:",
        textData
      );
      console.warn("Parse error:", e.message);

      data = {
        title: "Climode",
        body: textData || "新しい通知があります",
      };
    }
  } else {
    // No data in push event
    console.log("Push event has no data, using defaults");
    data = {
      title: "Climode",
      body: "新しい通知があります",
    };
  }

  const title = data.title || "Climode";
  const options = {
    body: data.body || "新しい通知があります",
    icon: data.icon || "/icon-192x192.png",
    badge: data.badge || "/badge-72x72.png",
    data: data.data || {},
    requireInteraction: false,
    tag: "climode-notification-" + Date.now(),
    renotify: true,
    vibrate: [200, 100, 200],
  };

  console.log("Showing notification with:", { title, options });

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => {
        console.log("Notification shown successfully");
      })
      .catch((error) => {
        console.error("Failed to show notification:", error);
      })
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle push subscription changes
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Push subscription changed:", event);
  // Handle subscription renewal if needed
});
