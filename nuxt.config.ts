// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  
  runtimeConfig: {
    public: {
      // Firebase config - Thêm default values
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || '',
      
      // API Gateway
      apiGatewayUrl: process.env.NUXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:4000',
    },
  },

  
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt"  // ← Thêm Pinia nếu chưa có
  ],
});