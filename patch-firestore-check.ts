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

const bannedRegex = /(private viewing|private-viewing|private concierge|concierge|private appointment|priority access|hurry|limited time|don't miss|offer ends)/gi;

async function run() {
  const collections = ['site_content', 'site_content_faqs', 'site_content_blogPosts', 'site_content_homeFAQs', 'site_content_shopProducts', 'site_content_heritageItems', 'site_content_methodologySteps', 'site_content_brideGallery', 'site_content_journalTrends'];
  
  let count = 0;
  for (const colName of collections) {
    const snap = await getDocs(collection(db, colName));
    for (const d of snap.docs) {
      let dataStr = JSON.stringify(d.data());
      
      let match;
      while ((match = bannedRegex.exec(dataStr)) !== null) {
          console.log(`Found ${match[0]} in ${colName}/${d.id}`);
          count++;
      }
    }
  }
  if (count === 0) {
      console.log("No banned terms found in Firestore!");
  }
}

run().then(() => { console.log('Done'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
