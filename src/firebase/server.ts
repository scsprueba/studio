'use server';

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore as getFirestoreSdk } from 'firebase/firestore';

// This is a hardcoded config object.
// In a real-world scenario, this should be loaded from environment variables.
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCCozUn2lAcvVM6VUmSFlnkLnLdP1jJVnU',
  authDomain: 'studio-6792195927-50f25.firebaseapp.com',
  projectId: 'studio-6792195927-50f25',
  storageBucket: 'studio-6792195927-50f25.appspot.com',
  messagingSenderId: '835504863875',
  appId: '1:835504863875:web:240adbdea3fa388b57b9b6',
};

function getFirebaseApp() {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

function getFirestoreInstance() {
    return getFirestoreSdk(getFirebaseApp());
}

// For server-side, it's often better to initialize on-demand.
export const getFirestore = () => getFirestoreInstance();