import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from './firebase-applet-config.json';

const app = initializeApp({
  credential: applicationDefault(),
  projectId: config.projectId,
});

const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const collections = ['site_content', 'site_content_faqs', 'site_content_blogPosts', 'site_content_homeFAQs', 'site_content_shopProducts', 'site_content_heritageItems', 'site_content_methodologySteps', 'site_content_brideGallery', 'site_content_journalTrends'];
  
  for (const colName of collections) {
    const colRef = db.collection(colName);
    const snap = await colRef.get();
    for (const doc of snap.docs) {
      let data = doc.data();
      let dataStr = JSON.stringify(data);
      let changed = false;
      
      if (dataStr.includes('19:30')) {
        console.log(`Found 19:30 in ${colName}/${doc.id}`);
        // Let's replace '10:00–19:30' to '10:00–19:00'
        if (dataStr.includes('10:00–19:30')) {
            dataStr = dataStr.replace(/10:00–19:30/g, '10:00–19:00');
            changed = true;
        }
        if (dataStr.includes('10:00 to 19:30')) {
            dataStr = dataStr.replace(/10:00 to 19:30/g, '10:00 to 19:00');
            changed = true;
        }
        if (dataStr.includes('10:00 - 19:30')) {
            dataStr = dataStr.replace(/10:00 - 19:30/g, '10:00 - 19:00');
            changed = true;
        }
      }
      
      if (changed) {
        console.log(`Updating ${colName}/${doc.id}...`);
        await doc.ref.set(JSON.parse(dataStr));
      }
    }
  }
}

run().then(() => console.log('Done')).catch(console.error);
