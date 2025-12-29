'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

// 🚨 REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy...",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "project-id.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "project-id",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "project-id.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// [Safety] Handle Invalid Config Gracefully
const getFirebaseApp = () => {
    try {
        return !getApps().length ? initializeApp(firebaseConfig) : getApp();
    } catch (e) {
        console.warn("Firebase Init Error:", e);
        return null;
    }
};

const app = getFirebaseApp();

export const messaging = async (): Promise<Messaging | null> => {
    if (typeof window !== 'undefined' && app && await isSupported()) {
        try {
            return getMessaging(app);
        } catch (e) {
            console.error("Firebase Messaging Error:", e);
            return null;
        }
    }
    return null;
};

async function isSupported() {
    const { isSupported } = await import('firebase/messaging');
    return isSupported();
}
