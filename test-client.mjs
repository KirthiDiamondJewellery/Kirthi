import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp, config.firestoreDatabaseId);

async function check() {
  const collections = ['site_content_shopProducts', 'site_content_blogPosts', 'site_content_journalTrends'];
  for (const c of collections) {
    try {
      const snap = await getDocs(collection(db, c));
      console.log(`Collection ${c} has ${snap.size} documents.`);
    } catch (e) {
      console.error(`Error on ${c}:`, e.message);
    }
  }
}

check().catch(console.error);
