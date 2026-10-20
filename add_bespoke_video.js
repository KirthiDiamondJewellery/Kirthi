import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
db.collection('site_content_pageVideos').doc('bespoke').set({
  videoUrl: 'https://www.youtube.com/watch?v=cGrZrg3_BQw',
  title: 'Bespoke Crafting Process',
  description: 'Inside the Kirthi Diamonds workshop',
  uploadDate: '2024-01-01',
  duration: 'PT5M',
  posterUrl: ''
}).then(() => {
  console.log('Added bespoke video to Firestore');
  process.exit(0);
}).catch(console.error);
