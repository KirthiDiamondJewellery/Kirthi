import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import config from './firebase-applet-config.json';
import fetch from 'node-fetch';
global.fetch = fetch as any; 

const app = initializeApp({
  projectId: config.projectId,
  appId: config.appId,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
});

const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'site_content_blogPosts'));
  for (const d of snap.docs) {
    if (d.data().id === 'artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference' || 
        d.data().id === 'antique-diamond-jewellery-designs-for-traditional-kerala-weddings' ||
        d.data().title?.includes('Artisanal') ||
        d.data().title?.includes('Antique')) {
      console.log('--- ' + d.id + ' ---');
      console.log(d.data().content);
    }
  }
}

run().then(() => { process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
