// services/firebaseService.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const firebaseService = {
  // Yêu cầu quyền thông báo
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        return await this.getFCMToken();
      } else {
        console.log('Unable to get permission to notify.');
        return null;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  },

  // Lấy FCM token
  async getFCMToken() {
    try {
      const currentToken = await getToken(messaging, { 
        vapidKey: 'YOUR_VAPID_KEY' 
      });
      if (currentToken) {
        console.log('FCM token:', currentToken);
        // Gửi token lên server để lưu trữ
        await this.sendTokenToServer(currentToken);
        return currentToken;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  // Gửi token lên server
  async sendTokenToServer(token) {
    try {
      await fetch('/api/save-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  },

  // Lắng nghe thông báo đến
  onMessage(callback) {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);
    });
  },

  // Subscribe to topic
  async subscribeToTopic(token, topic) {
    try {
      const response = await fetch('/api/subscribe-to-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, topic }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  }
};