const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const fs = require("fs");

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  snap.forEach(doc => {
    console.log(doc.id, "=>", doc.data().title);
  });
}
test().catch(console.error);
