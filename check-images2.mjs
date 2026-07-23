import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, collection, getDocs } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

async function run() {
  const snaps = await getDocs(collection(db, 'site_content_blogPosts'));
  snaps.forEach(d => {
    const data = d.data();
    if (data.title.includes('Investment') || data.title.includes('Artisanal')) {
      console.log(`\n\n--- ${data.title} ---`);
      for (const key in data) {
         if (key === 'content') continue; // too long
         let val = String(data[key]);
         if (val.length > 200) val = val.substring(0, 200) + '...';
         console.log(`${key}: ${val}`);
      }
    }
  });
  process.exit(0);
}
run();
