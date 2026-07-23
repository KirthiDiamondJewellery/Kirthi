import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'site_content_blogPosts'));
  console.log('Posts count:', querySnapshot.size);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(doc.id, 'Image starts with:', data.image ? data.image.substring(0, 50) : 'NONE');
  });
  process.exit(0);
}
run();
