const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc, initializeFirestore } = require('firebase/firestore');

const firebaseConfig = {
  "projectId": "esoteric-portal-471501-t2",
  "firestoreDatabaseId": "ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  for (let d of snap.docs) {
    const data = d.data();
    if (data.title === "Artisanal Diamond Jewellery vs Mass-Produced: What Is the Real Difference?") {
      let content = data.content;
      content = content.replace(
        "polished by hand, inspected against the original design and certificate, and presented in a private viewing at the boutique.",
        "polished by hand, inspected against the original design and certificate, and presented at a one-on-one consultation at the boutique."
      );
      content = content.replace(
        "Every piece on display is artisanally finished; bespoke commissions are taken in person or via private appointment.",
        "Every piece on display is artisanally finished; bespoke commissions are taken in person or by consultation appointment."
      );
      await updateDoc(doc(db, "site_content_blogPosts", d.id), { content });
      console.log("Updated Artisanal post copy.");
    }
  }
  process.exit(0);
}
run();
