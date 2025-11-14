console.log("DEBUG: VITE_FIREBASE_API_KEY =", import.meta.env.VITE_FIREBASE_API_KEY);

// Minimal firebase stub that initializes only when VITE_FIREBASE_API_KEY is provided.
// This prevents runtime errors during development when no Firebase config is set.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

let app = null;
let db = null;
let auth = { currentUser: null };

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (apiKey) {
  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("Firebase initialized");
} else {
  console.warn("Firebase not configured. Set VITE_FIREBASE_API_KEY in .env to enable Firestore/auth.");
}

export { app, db, auth };
export const isFirebaseInitialized = !!app;
