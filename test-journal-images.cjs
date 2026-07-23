const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'site_content_blogPosts'));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data().image?.substring(0, 100));
  });
  console.log('Trends');
  const trendSnapshot = await getDocs(collection(db, 'site_content_journalTrends'));
  trendSnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data().image?.substring(0, 100));
  });
}
run();
