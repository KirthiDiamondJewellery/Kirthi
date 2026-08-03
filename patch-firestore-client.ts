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
  const collections = ['site_content', 'site_content_faqs', 'site_content_blogPosts', 'site_content_homeFAQs', 'site_content_shopProducts', 'site_content_heritageItems', 'site_content_methodologySteps', 'site_content_brideGallery', 'site_content_journalTrends'];
  
  let found = false;
  for (const colName of collections) {
    const snap = await getDocs(collection(db, colName));
    for (const d of snap.docs) {
      let dataStr = JSON.stringify(d.data());
      // search for occurrences of 7:30 or 19:30 and print the surrounding 40 characters
      let matches = dataStr.match(/.{0,40}(7:30|19:30).{0,40}/g);
      if (matches) {
        let kochiRelated = matches.some(m => m.toLowerCase().includes('kochi') || m.includes('10'));
        if (kochiRelated) {
           console.log(`--- ${colName}/${d.id} ---`);
           for (let m of matches) {
              console.log(m);
           }
           found = true;
        }
      }
    }
  }
  if (!found) console.log("All clean for Kochi 19:30!");
}

run().then(() => { console.log('Done'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
