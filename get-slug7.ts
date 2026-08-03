import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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
  const d = await getDoc(doc(db, 'site_content_blogPosts', 'id-khdjfej42'));
  const content = d.data()?.content || "";
  let m = content.match(/.{0,50}This is held in.{0,50}/g);
  console.log(m);
}

run().then(() => { process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
