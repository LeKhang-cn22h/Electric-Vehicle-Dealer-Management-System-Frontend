// // /public/firebase-messaging-sw.js

// importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyBFqxQqUvEemu5e6Rbt5uaSCoJDwkKij5w", // copy từ env
//   authDomain: "electric-vehicle-75fda.firebaseapp.com",
//   projectId: "electric-vehicle-75fda",
//   storageBucket: "electric-vehicle-75fda.firebasestorage.app",
//   messagingSenderId: "889088853950",
//   appId: "1:889088853950:web:ab9af2b8ece71e4980dbef"
// });

// const messaging = firebase.messaging();

// // Optionally handle background messages:
// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   const notificationTitle = payload.notification?.title || 'Background Message Title';
//   const notificationOptions = {
//     body: payload.notification?.body || 'Background Message body.',
//     // icon: '/firebase-logo.png' // nếu có icon thì thêm vào
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
