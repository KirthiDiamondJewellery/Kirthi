import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs } from 'firebase/firestore';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const querySnapshot = await getDocs(collection(db, 'site_content_blogPosts'));
    console.log('Posts count:', querySnapshot.size);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id, 'Image starts with:', data.image ? data.image.substring(0, 50) : 'NONE');
    });
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
run();
