// app/plugins/firebase.client.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  };

  // Validate trước khi init
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Missing Firebase config. Check your .env file');
    return;
  }

  try {
    const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
    
    console.log('✅ Firebase initialized:', firebaseConfig.projectId);

    return {
      provide: {
        firebase: firebaseApp,
      },
    };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
});