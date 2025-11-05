'use server';

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore as getFirestoreSdk } from 'firebase/firestore';

// Esta configuración es pública y segura.
// Al estar directamente en el código, eliminamos todos los errores de variables de entorno.
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCCozUn2lAcvVM6VUmSFlnkLnLdP1jJVnU',
  authDomain: 'studio-6792195927-50f25.firebaseapp.com',
  projectId: 'studio-6792195927-50f25',
  storageBucket: 'studio-6792195927-50f25.appspot.com',
  messagingSenderId: '835504863875',
  appId: '1:835504863875:web:240adbdea3fa388b57b9b6',
};

// Función de memoización simple para evitar reinicializar en cada llamada
let app: FirebaseApp | undefined;
function getFirebaseApp() {
    if (app) return app;
    if (getApps().length > 0) {
        app = getApp();
    } else {
        app = initializeApp(firebaseConfig);
    }
    return app;
}

let db: any;
function getFirestoreInstance() {
    if (db) return db;
    db = getFirestoreSdk(getFirebaseApp());
    return db;
}

// Para el servidor, exportamos una función async para asegurar que se llame correctamente
export async function getFirestore() {
    return getFirestoreInstance();
}
