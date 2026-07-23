import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

async function run() {
  const snaps = await getDocs(collection(db, 'site_content_blogPosts'));
  snaps.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id}, Title: ${data.title}`);
    console.log(`  featuredImage: ${data.featuredImage ? data.featuredImage.substring(0, 100) : 'none'}`);
  });
  console.log("--- Trends ---");
  const tsnaps = await getDocs(collection(db, 'site_content_journalTrends'));
  tsnaps.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id}, Title: ${data.title}`);
    console.log(`  featuredImage: ${data.featuredImage ? data.featuredImage.substring(0, 100) : 'none'}`);
  });
  process.exit(0);
}
run();
