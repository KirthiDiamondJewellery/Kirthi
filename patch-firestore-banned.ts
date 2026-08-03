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

const bannedRegex = /(private viewing|private-viewing|private concierge|concierge|private appointment|priority access|hurry|limited time|don't miss|offer ends)/gi;

async function run() {
  const collections = ['site_content', 'site_content_faqs', 'site_content_blogPosts', 'site_content_homeFAQs', 'site_content_shopProducts', 'site_content_heritageItems', 'site_content_methodologySteps', 'site_content_brideGallery', 'site_content_journalTrends'];
  
  for (const colName of collections) {
    const snap = await getDocs(collection(db, colName));
    for (const d of snap.docs) {
      let data = d.data();
      let dataStr = JSON.stringify(data);
      let origStr = dataStr;
      
      // Known instances
      dataStr = dataStr.replace(/and presented in a private viewing at the boutique\./gi, "and presented at a quiet unveiling at the boutique.");
      dataStr = dataStr.replace(/bespoke commissions are taken in person or via private appointment\./gi, "bespoke commissions are taken in person or by appointment.");
      dataStr = dataStr.replace(/This is held in our private appointment space at Kochi or Calicut\./gi, "This is held in a reserved consultation space at our Kochi or Calicut boutique.");

      // General replacement
      dataStr = dataStr.replace(/private viewing/gi, "a quiet unveiling");
      dataStr = dataStr.replace(/private-viewing/gi, "a quiet unveiling");
      dataStr = dataStr.replace(/private concierge/gi, "arrange a visit");
      dataStr = dataStr.replace(/concierge/gi, "arrange a visit");
      dataStr = dataStr.replace(/private appointment/gi, "by appointment");
      dataStr = dataStr.replace(/priority access/gi, "arrange a visit");
      dataStr = dataStr.replace(/hurry/gi, "arrange a visit");
      dataStr = dataStr.replace(/limited time/gi, "arrange a visit");
      dataStr = dataStr.replace(/don't miss/gi, "arrange a visit");
      dataStr = dataStr.replace(/offer ends/gi, "arrange a visit");
      
      // Let's print out what we changed
      let match;
      while ((match = bannedRegex.exec(origStr)) !== null) {
          console.log(`Found ${match[0]} in ${colName}/${d.id}`);
      }

      if (dataStr !== origStr) {
        console.log(`Updating ${colName}/${d.id}...`);
        await setDoc(doc(db, colName, d.id), JSON.parse(dataStr));
      }
    }
  }
}

run().then(() => { console.log('Done'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
