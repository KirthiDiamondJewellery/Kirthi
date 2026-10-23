import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import { getStorage, ref, getMetadata, updateMetadata } from 'firebase/storage';

import appletConfig from '../../firebase-applet-config.json';

const getEnv = (key: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {}
  return '';
};

const firebaseConfig = {
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || appletConfig.projectId,
  appId: getEnv('VITE_FIREBASE_APP_ID') || appletConfig.appId,
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || appletConfig.apiKey,
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || appletConfig.authDomain,
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || appletConfig.storageBucket,
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || appletConfig.messagingSenderId,
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID') || appletConfig.measurementId,
  firestoreDatabaseId: getEnv('VITE_FIREBASE_FIRESTORE_DB_ID') || appletConfig.firestoreDatabaseId || "(default)"
};

export const app = initializeApp(firebaseConfig);

// Suppress Firestore connection warnings in the sandboxed preview environment
setLogLevel('silent');

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Failed to set auth state persistence", err);
});

export const storage = getStorage(app);

/**
 * Verifies and optionally updates the Cache-Control headers for high-resolution images
 * stored in Firebase Storage to ensure optimal long-term browser caching.
 * 
 * @param imagePath The path to the image in the storage bucket (e.g., 'images/hero.jpg')
 * @returns Object with verification status and metadata
 */
export async function verifyAndOptimizeImageCaching(imagePath: string) {
  try {
    const imageRef = ref(storage, imagePath);
    const metadata = await getMetadata(imageRef);
    const currentCacheControl = metadata.cacheControl || '';
    
    // Optimal Cache-Control for long-term browser caching (1 year)
    const optimalCacheControl = 'public, max-age=31536000, immutable';
    
    let isOptimal = currentCacheControl.includes('max-age=31536000');
    
    if (!isOptimal) {
      console.log(`[Firebase Storage] Optimizing caching headers for ${imagePath}...`);
      await updateMetadata(imageRef, {
        cacheControl: optimalCacheControl
      });
      console.log(`[Firebase Storage] Caching header updated successfully to: ${optimalCacheControl}`);
      isOptimal = true;
    } else {
      console.log(`[Firebase Storage] ${imagePath} already has optimal caching: ${currentCacheControl}`);
    }
    
    return {
      success: true,
      path: imagePath,
      isOptimal,
      cacheControl: isOptimal ? optimalCacheControl : currentCacheControl
    };
  } catch (error) {
    console.error(`[Firebase Storage] Error verifying/optimizing cache for ${imagePath}:`, error);
    return {
      success: false,
      path: imagePath,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Simple connection test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection successful.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
