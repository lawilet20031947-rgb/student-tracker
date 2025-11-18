console.log("DEBUG: VITE_FIREBASE_API_KEY =", import.meta.env.VITE_FIREBASE_API_KEY);

// Minimal firebase stub that initializes only when VITE_FIREBASE_API_KEY is provided.
// This prevents runtime errors during development when no Firebase config is set.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

let app = null;
let auth = null;
let db = null;
let functions = null;

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isFirebaseInitialized = Boolean(apiKey && apiKey !== "undefined" && apiKey.trim() !== "");

if (isFirebaseInitialized) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase not configured. Set VITE_FIREBASE_API_KEY in .env to enable Firestore/auth.");
  // Create stub objects to prevent crashes
  auth = { currentUser: null, onAuthStateChanged: () => () => {} };
  db = null;
  functions = null;
}

export { app, auth, db, functions, isFirebaseInitialized };
