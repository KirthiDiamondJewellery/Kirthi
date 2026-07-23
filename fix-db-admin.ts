import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const rawConfig = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const firebaseConfig = JSON.parse(rawConfig);
process.env.FIREBASE_PROJECT_ID = firebaseConfig.projectId;

initializeApp({
  projectId: firebaseConfig.projectId,
});

const db = getFirestore(firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' ? firebaseConfig.firestoreDatabaseId : undefined);

const metaMap = {
  "investment-grade-diamond-jewellery": "What makes a diamond investment-grade? Certification, cut, carat thresholds, and resale economics for Indian buyers — a practical guide from Kirthi Diamonds.",
  "diamond-jewellery-vs-gold": "Diamonds or gold? How making charges, buyback policies, and resale value compare for Kerala buyers weighing jewellery as a long-term store of value.",
  "gia-vs-igi-certified-diamonds": "GIA and IGI grade diamonds differently in subtle ways. What each certificate tells you, how they compare on rigour and price, and which suits your purchase.",
  "antique-diamond-jewellery": "Traditional Kerala wedding jewellery, reinterpreted: antique diamond designs for Hindu, Christian, and Muslim ceremonies, and how bespoke commissions work.",
  "artisanal-vs-mass-produced": "Individually certified stones, hand-cut settings, and lifetime accountability — the four practical differences between artisanal and mass-produced jewellery.",
  "how-to-identify-quality": "What separates a quality diamond house from a volume retailer: craftsmanship, certification, sourcing, and the questions to ask before you buy.",
  "the-modern-kerala-bride": "How to balance ceremonial gold with bespoke diamond pieces — a practical trousseau framework for the modern Kerala bride."
};

function fixContent(text: string) {
  let modified = text;
  modified = modified.replace(/presented in a private viewing at the boutique\./gi, "presented at a one-on-one consultation at the boutique.");
  modified = modified.replace(/taken in person or via private appointment\./gi, "taken in person or by consultation appointment.");
  
  modified = modified.replace(/\bconcierge\b/gi, "atelier");
  modified = modified.replace(/\bprivate viewing\b/gi, "one-on-one consultation");
  modified = modified.replace(/\bprivate appointment\b/gi, "consultation appointment");
  modified = modified.replace(/\.\s+one-on-one/g, ". One-on-one");
  
  modified = modified.replace(/\*\*\s+(.*?)\s+\*\*/g, "**$1**");
  modified = modified.replace(/([^\n])\n- /g, "$1\n\n- ");
  modified = modified.replace(/([^\n])\n\d+\.\s/g, "$1\n\n1. ");
  return modified;
}

async function run() {
  const collections = ["site_content_blogPosts", "site_content_journalTrends"];
  for (const coll of collections) {
    const colRef = db.collection(coll);
    const snapshot = await colRef.get();
    for (const d of snapshot.docs) {
      const data = d.data();
      let content = data.content || "";
      let newContent = fixContent(content);
      
      let metaDesc = data.metaDescription || "";
      let newMetaDesc = metaDesc.replace(/[#*_]/g, '').trim();
      
      const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || d.id;
      
      for (const key of Object.keys(metaMap)) {
        if (pSlug.includes(key)) {
          newMetaDesc = metaMap[key as keyof typeof metaMap];
          break;
        }
      }
      
      let newImage = data.image;
      if (newImage === "logo.png" || newImage === "/logo.png" || !newImage) {
        newImage = "https://kirthidiamonds.com/og-cover.jpg";
      }
      
      const updateData: any = {};
      if (newContent !== content) updateData.content = newContent;
      if (newMetaDesc !== metaDesc) updateData.metaDescription = newMetaDesc;
      
      let newFeaturedImage = data.featuredImage || newImage;
      if (newFeaturedImage === "logo.png" || newFeaturedImage === "/logo.png" || newFeaturedImage.startsWith("data:")) {
          newFeaturedImage = "https://kirthidiamonds.com/og-cover.jpg";
      }
      if (newFeaturedImage !== data.featuredImage) updateData.featuredImage = newFeaturedImage;
      
      if (Object.keys(updateData).length > 0) {
        console.log(`Updating ${d.id} (${pSlug}) in ${coll}`);
        await d.ref.update(updateData);
      }
    }
  }
}
run().catch(console.error);
