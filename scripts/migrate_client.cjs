const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, updateDoc } = require("firebase/firestore");

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

const bannedPhrases = [
  { regex: /\bconcierge\b/gi, replacement: "atelier" },
  { regex: /\bprivate viewing\b/gi, replacement: "one-on-one consultation" },
  { regex: /\bprivate appointment\b/gi, replacement: "consultation appointment" },
  { regex: /\bprivate boutique appointment\b/gi, replacement: "bespoke consultation" },
  { regex: /\bcolor\b/g, replacement: "colour" },
  { regex: /\bColor\b/g, replacement: "Colour" },
  { regex: /\bjewelry\b/g, replacement: "jewellery" },
  { regex: /\bJewelry\b/g, replacement: "Jewellery" },
  { regex: /\bpersonalized\b/g, replacement: "personalised" },
  { regex: /\bPersonalized\b/g, replacement: "Personalised" }
];

async function run() {
  const collections = ["site_content_blogPosts", "site_content_brideGallery", "site_content_heritageItems", "site_content_methodologySteps"];
  
  for (const collName of collections) {
    const snap = await getDocs(collection(db, collName));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      let updated = false;
      const updates = {};
      
      // Basic text replacement for content
      if (data.content && typeof data.content === 'string') {
        let text = data.content;
        for (const rule of bannedPhrases) {
          text = text.replace(rule.regex, rule.replacement);
        }
        if (text !== data.content) {
          updates.content = text;
          updated = true;
        }
      }
      
      if (updated) {
        try {
          await updateDoc(doc(db, collName, docSnap.id), updates);
          console.log("Updated " + docSnap.id + " in " + collName);
        } catch (e) {
          console.error("Failed to update " + docSnap.id, e);
        }
      }
    }
  }
}

run().then(() => {
  console.log("Migration check finished");
  process.exit(0);
});
