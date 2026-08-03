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
    if (d.data().id === 'artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference' || 
        d.data().id === 'antique-diamond-jewellery-designs-for-traditional-kerala-weddings' ||
        d.data().title?.includes('Artisanal') ||
        d.data().title?.includes('Antique')) {
      let data = d.data();
      let changed = false;
      
      // We know there might be a trailing 'consultation appointment' that shouldn't be there, 
      // let's force the Exact matching just in case.
      
      if (data.content) {
         if (data.content.includes("presented at a one-on-one consultation at the boutique.")) {
            data.content = data.content.replace("presented at a one-on-one consultation at the boutique.", "presented at a quiet unveiling at the boutique.");
            changed = true;
         }
         
         if (data.content.includes("bespoke commissions are taken in person or by consultation appointment.")) {
             data.content = data.content.replace("bespoke commissions are taken in person or by consultation appointment.", "bespoke commissions are taken in person or by appointment.");
             changed = true;
         }
         
         if (data.content.includes("This is held in a reserved consultation space at our Kochi or Calicut boutique.")) {
             console.log("Found antique string perfectly.");
         } else if (data.content.includes("This is held in our private appointment space at Kochi or Calicut.")) {
             data.content = data.content.replace("This is held in our private appointment space at Kochi or Calicut.", "This is held in a reserved consultation space at our Kochi or Calicut boutique.");
             changed = true;
         } else {
             // Maybe it says something else? Let's check for 'Kochi or Calicut'
             let m = data.content.match(/.{0,30}Kochi or Calicut.{0,30}/);
             if (m) console.log("Context in Antique:", m[0]);
         }
      }
      
      if (changed) {
          console.log("Updating", d.id);
          await setDoc(doc(db, 'site_content_blogPosts', d.id), data);
      }
      
      console.log('--- ' + data.id + ' ---');
      console.log(data.content);
    }
  }
}

run().then(() => { process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
