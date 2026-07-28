const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const appletConfig = {
  "projectId": "esoteric-portal-471501-t2",
  "appId": "1:947011029632:web:e9157239b93efa64e67465",
  "apiKey": "AIzaSyDYn2EZt-y1Q7gDKe-AbJ77UVfhaf5_jkg",
  "authDomain": "esoteric-portal-471501-t2.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764",
  "storageBucket": "esoteric-portal-471501-t2.firebasestorage.app",
  "messagingSenderId": "947011029632",
  "measurementId": "G-9ZW9BR79K9"
};

const app = initializeApp(appletConfig);
const db = getFirestore(app, appletConfig.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log("Title:", data.title);
    if (data.title && data.title.includes("GIA")) {
      console.log("MATCH:", data.title);
      console.log("Slug:", data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  });
}
run();
