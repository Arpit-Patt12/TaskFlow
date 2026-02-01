import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read env vars once for clearer errors and easier debugging
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const missing = [] as string[];
if (!apiKey) missing.push("VITE_FIREBASE_API_KEY");
if (!authDomain) missing.push("VITE_FIREBASE_AUTH_DOMAIN");
if (!projectId) missing.push("VITE_FIREBASE_PROJECT_ID");
if (!storageBucket) missing.push("VITE_FIREBASE_STORAGE_BUCKET");
if (!messagingSenderId) missing.push("VITE_FIREBASE_MESSAGING_SENDER_ID");
if (!appId) missing.push("VITE_FIREBASE_APP_ID");

if (missing.length > 0) {
  const msg = `Missing Firebase config env var(s): ${missing.join(", ")}. Add them to ".env.local" (project root) and restart the dev server.`;
  // Helpful console guidance for development
  // eslint-disable-next-line no-console
  console.error("⚠️ Firebase initialization failed — " + msg);
  throw new Error(msg);
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(
    "❌ Failed to initialize Firebase. Check API key and project settings in Firebase Console.",
    err,
  );
  throw err;
}

export const app = firebaseApp;
export const auth = firebaseApp ? getAuth(firebaseApp) : undefined;
export const db = firebaseApp ? getFirestore(firebaseApp) : undefined;
