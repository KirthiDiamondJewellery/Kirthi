const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'site_content_blogPosts'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log('POST:', doc.id);
    console.log('Image:', data.image ? data.image.substring(0, 50) + '...' : 'NONE');
  });
}
run();
