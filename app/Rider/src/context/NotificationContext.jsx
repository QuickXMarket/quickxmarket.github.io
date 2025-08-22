import { createContext, useContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { useCoreContext } from "./CoreContext";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { makeRequest, navigate } = useCoreContext();
  const { user } = useAuthContext();

  const setupPushNotifications = () => {
    // Request permission on mobile
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        console.warn("Push permission not granted");
      }
    });

    // On successful registration, get FCM token
    PushNotifications.addListener("registration", async (token) => {
      try {
        await makeRequest({
          method: "PATCH",
          url: "/api/rider/update-fcm-token",
          data: {
            fcmToken: token.value,
          },
        });
        console.log("FCM token saved successfully");
      } catch (error) {
        console.error("Failed to save FCM token:", error.message);
      }
    });

    // If registration fails
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Registration error:", error);
    });

    // Handle received push
    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification) => {
        const route = notification.data?.route;
        console.log(notification);
        await LocalNotifications.schedule({
          notifications: [
            {
              title: notification?.title || "New Notification",
              body: notification?.body || "",
              id: Math.floor(Math.random() * 1000000),
              ...(route && { extra: { route } }),
              smallIcon: "ic_stat_notify",
            },
          ],
        });
      }
    );

    // Handle user tapping the notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        const route = notification.notification.data?.route;
        if (route) {
          navigate(route);
        }
      }
    );

    LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const route = event.notification.extra?.route;
        if (route) {
          navigate(route);
        }
      }
    );
  };

  useEffect(() => {
    if (!user) return;
    if (Capacitor.isNativePlatform()) setupPushNotifications();
  }, [user]);

  const value = {
    setupPushNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
