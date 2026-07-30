const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

initializeApp({ projectId: config.projectId });
const db = getFirestore(config.firestoreDatabaseId);

async function check() {
  const collections = ['site_content_shopProducts', 'site_content_blogPosts', 'site_content_journalTrends'];
  for (const c of collections) {
    const snap = await db.collection(c).get();
    console.log(`Collection ${c} has ${snap.size} documents.`);
  }
}

check().catch(console.error);
