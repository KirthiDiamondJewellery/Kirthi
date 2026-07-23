import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

const descriptions = {
  "investment-grade-diamond-jewellery-a-complete-buyer-s-guide-for-india": "What makes a diamond investment-grade? Certification, cut, carat thresholds, and resale economics for Indian buyers — a practical guide from Kirthi Diamonds.",
  "diamond-jewellery-vs-gold-as-an-investment-in-kerala-what-you-need-to-know": "Diamonds or gold? How making charges, buyback policies, and resale value compare for Kerala buyers weighing jewellery as a long-term store of value.",
  "gia-vs-igi-certified-diamonds-which-should-you-choose-when-buying-in-india": "GIA and IGI grade diamonds differently in subtle ways. What each certificate tells you, how they compare on rigour and price, and which suits your purchase.",
  "antique-diamond-jewellery-designs-for-traditional-kerala-weddings": "Traditional Kerala wedding jewellery, reinterpreted: antique diamond designs for Hindu, Christian, and Muslim ceremonies, and how bespoke commissions work.",
  "artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference": "Individually certified stones, hand-cut settings, and lifetime accountability — the four practical differences between artisanal and mass-produced jewellery."
};

async function run() {
  const snaps = await getDocs(collection(db, 'site_content_blogPosts'));
  for (const d of snaps.docs) {
    const data = d.data();
    const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || d.id;
    
    let updates = {};
    if (descriptions[pSlug]) {
      updates.metaDescription = descriptions[pSlug];
    }
    
    if (data.images && data.images.includes('data:image')) {
      // Clear data URIs
      updates.images = [];
      updates.image = "";
    }
    if (data.image && data.image.includes('data:image')) {
      updates.image = "";
    }
    
    // Task 4 copy fixes
    if (data.content) {
      let newContent = data.content;
      if (pSlug === "artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference") {
        newContent = newContent.replace(
          "polished by hand, inspected against the original design and certificate, and presented in a private viewing at the boutique.",
          "polished by hand, inspected against the original design and certificate, and presented at a one-on-one consultation at the boutique."
        );
        newContent = newContent.replace(
          "Every piece on display is artisanally finished; bespoke commissions are taken in person or via private appointment.",
          "Every piece on display is artisanally finished; bespoke commissions are taken in person or by consultation appointment."
        );
      }
      if (newContent !== data.content) {
        updates.content = newContent;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      console.log(`Updating doc ${d.id}...`);
      await updateDoc(doc(db, 'site_content_blogPosts', d.id), updates);
    }
  }
  console.log("Done");
  process.exit(0);
}
run();
