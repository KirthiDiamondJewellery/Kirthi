const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, initializeFirestore } = require('firebase/firestore');

const firebaseConfig = {
  "projectId": "esoteric-portal-471501-t2",
  "firestoreDatabaseId": "ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  snap.forEach(doc => {
    const data = doc.data();
    const title = data.title || "";
    const pSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
    console.log(doc.id, '->', title, '->', pSlug);
  });
  process.exit(0);
}
run();
