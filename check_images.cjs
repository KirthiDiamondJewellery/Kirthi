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
    const title = data.title;
    console.log("Title:", title);
    console.log("featuredImage:", data.featuredImage?.substring(0,50));
    console.log("coverImage:", data.coverImage?.substring(0,50));
    console.log("image:", data.image?.substring(0,50));
    if (data.images) console.log("images:", data.images[0]?.substring(0,50));
    console.log("-------------");
  });
  process.exit(0);
}
run();
