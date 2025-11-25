// app/stores/notification.ts
import { defineStore } from "pinia";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { Messaging, MessagePayload } from "firebase/messaging";
import type { FirebaseApp } from "firebase/app";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    messaging: null as Messaging | null,
    fcmToken: null as string | null,
    notifications: [] as MessagePayload[],
  }),

  actions: {
    async initializeFCM() {
      try {
        const { $firebase } = useNuxtApp();
        const config = useRuntimeConfig();
        
        if (!$firebase) {
          console.error('❌ Firebase not initialized');
          return null;
        }

        // Get messaging instance
        this.messaging = getMessaging($firebase as FirebaseApp);

        // Request permission
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
          console.log("✅ Notification permission granted");

          // Get FCM token
          const token = await getToken(this.messaging, {
            vapidKey: config.public.firebaseVapidKey as string,
          });
          
          this.fcmToken = token;
          console.log("✅ FCM Token obtained:", token.substring(0, 30) + '...');

          // ✅ KHÔNG CẦN save token riêng nữa
          // Token sẽ được gửi kèm theo khi tạo contract request
          console.log("ℹ️  FCM token will be sent with contract request");

          return token;
        } else {
          console.warn("⚠️ Notification permission denied");
          return null;
        }
      } catch (error) {
        console.error("❌ Error initializing FCM:", error);
        throw error;
      }
    },

    onMessage(callback: (payload: MessagePayload) => void) {
      if (!this.messaging) {
        console.warn("⚠️ Messaging not initialized");
        return;
      }

      onMessage(this.messaging, (payload) => {
        console.log("📩 Foreground message received:", payload);
        this.notifications.push(payload);
        callback(payload);
      });
    },

    clearNotifications() {
      this.notifications = [];
    },
  },
});
