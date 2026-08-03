import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
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
    if (d.data().id === 'id-khdjfej42') {
      let data = d.data();
      let changed = false;
      
      data.content = data.content.replace("This is held in our consultation appointment space at Kochi or Calicut.", "This is held in a reserved consultation space at our Kochi or Calicut boutique.");
      data.content = data.content.replace("This is held in our by appointment space at Kochi or Calicut.", "This is held in a reserved consultation space at our Kochi or Calicut boutique.");
      
      data.content = data.content.replace("Heritage consultations for bridal commissions are by consultation appointment.", "Heritage consultations for bridal commissions are by appointment.");
      
      await setDoc(doc(db, 'site_content_blogPosts', d.id), data);
      
      console.log('--- ' + data.id + ' ---');
      console.log(data.content.substring(data.content.length - 200));
    }
  }
}

run().then(() => { process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
