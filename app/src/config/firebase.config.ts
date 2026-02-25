import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

const getApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured) return null;
  if (_app) return _app;
  _app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return _app;
};

export const getFirestoreDB = (): Firestore | null => {
  if (_db) return _db;
  const app = getApp();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (_storage) return _storage;
  const app = getApp();
  if (!app) return null;
  _storage = getStorage(app);
  return _storage;
};
