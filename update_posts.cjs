const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc, initializeFirestore } = require('firebase/firestore');

const firebaseConfig = {
  "projectId": "esoteric-portal-471501-t2",
  "firestoreDatabaseId": "ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

const descriptions = {
  "Investment-Grade Diamond Jewellery: A Complete Buyer's Guide for India": 
    "What makes a diamond investment-grade? Certification, cut, carat thresholds, and resale economics for Indian buyers — a practical guide from Kirthi Diamonds.",
  "Diamond Jewellery vs Gold as an Investment in Kerala: What You Need to Know":
    "Diamonds or gold? How making charges, buyback policies, and resale value compare for Kerala buyers weighing jewellery as a long-term store of value.",
  "GIA vs IGI Certified Diamonds: Which Should You Choose When Buying in India?":
    "GIA and IGI grade diamonds differently in subtle ways. What each certificate tells you, how they compare on rigour and price, and which suits your purchase.",
  "Antique Diamond Jewellery Designs for Traditional Kerala Weddings":
    "Traditional Kerala wedding jewellery, reinterpreted: antique diamond designs for Hindu, Christian, and Muslim ceremonies, and how bespoke commissions work.",
  "Artisanal Diamond Jewellery vs Mass-Produced: What Is the Real Difference?":
    "Individually certified stones, hand-cut settings, and lifetime accountability — the four practical differences between artisanal and mass-produced jewellery."
};

async function run() {
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  for (let d of snap.docs) {
    const data = d.data();
    const title = data.title;
    if (descriptions[title]) {
      console.log("Updating:", title);
      await updateDoc(doc(db, "site_content_blogPosts", d.id), {
        metaDescription: descriptions[title]
      });
    }
  }
  process.exit(0);
}
run();
