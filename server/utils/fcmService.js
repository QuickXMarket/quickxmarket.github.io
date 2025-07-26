import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
    "utf-8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Send a push notification to a specific FCM token.
 * @param {string} fcmToken - Recipient's FCM token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Notification body
 */

export const sendPushNotification = async (
  fcmToken,
  title,
  body,
  data = {}
) => {
  if (!fcmToken) return;

  const message = {
    notification: {
      title,
      body,
    },
    icon: "ic_stat_notify",
    data: {
      ...data,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Notification error:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Details:", error.errorInfo);

    if (
      error.code === "messaging/invalid-argument" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      console.warn("Invalid or unregistered FCM token:", fcmToken);
    }
  }
};
