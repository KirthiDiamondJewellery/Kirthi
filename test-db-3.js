import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const c1 = await getDocs(collection(db, 'site_content_journalTrends'));
  console.log('Trends count:', c1.size);
  c1.forEach(d => console.log(d.id, d.data().image?.substring(0, 30)));
  
  const c2 = await getDocs(collection(db, 'site_content_boutiqueProducts'));
  console.log('Products count:', c2.size);
  c2.forEach(d => console.log(d.id, d.data().image?.substring(0, 30)));
  
  process.exit(0);
}
run();
