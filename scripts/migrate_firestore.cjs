const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const projectId = 'esoteric-portal-471501-t2';
const dbId = 'ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764';
const bucketName = 'esoteric-portal-471501-t2.firebasestorage.app';

admin.initializeApp({
  projectId,
  storageBucket: bucketName,
});

const db = getFirestore();
db.settings({ databaseId: dbId });

const storage = getStorage().bucket();

const bannedPhrases = [
  { regex: /private viewing/gi, replacement: "one-on-one consultation" },
  { regex: /private appointment/gi, replacement: "consultation appointment" },
  { regex: /private boutique appointment/gi, replacement: "consultation appointment" },
  { regex: /concierge/gi, replacement: "atelier" }
];

const spellings = [
  { regex: /jewelry/g, replacement: "jewellery" },
  { regex: /Jewelry/g, replacement: "Jewellery" },
  { regex: /endeavor/g, replacement: "endeavour" },
  { regex: /Endeavor/g, replacement: "Endeavour" },
  { regex: /color/g, replacement: "colour" },
  { regex: /Color/g, replacement: "Colour" }
];

const metaDescriptions = {
  "Investment-Grade": "What makes a diamond investment-grade? Certification, cut, carat thresholds, and resale economics for Indian buyers — a practical guide from Kirthi Diamonds.",
  "Diamond vs Gold": "Diamonds or gold? How making charges, buyback policies, and resale value compare for Kerala buyers weighing jewellery as a long-term store of value.",
  "GIA vs IGI": "GIA and IGI grade diamonds differently in subtle ways. What each certificate tells you, how they compare on rigour and price, and which suits your purchase.",
  "Antique": "Traditional Kerala wedding jewellery, reinterpreted: antique diamond designs for Hindu, Christian, and Muslim ceremonies, and how bespoke commissions work.",
  "Artisanal vs Mass-Produced": "Individually certified stones, hand-cut settings, and lifetime accountability — the four practical differences between artisanal and mass-produced jewellery.",
  "How to Identify Quality": "What separates a quality diamond house from a volume retailer: craftsmanship, certification, sourcing, and the questions to ask before you buy.",
  "Modern Kerala Bride": "How to balance ceremonial gold with bespoke diamond pieces — a practical trousseau framework for the modern Kerala bride.",
  "Onam 2026": "What Kerala buyers should know before Onam diamond purchases: certification, pricing patterns, commission timelines, and how to judge festival offers.",
};

async function processImage(dataUri, id) {
  try {
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Resize & convert to webp
    const imageBuffer = await sharp(buffer)
      .resize(1200, 630, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
      
    const filename = `blog-images/${id}-${uuidv4()}.webp`;
    const file = storage.file(filename);
    await file.save(imageBuffer, {
      metadata: { contentType: 'image/webp' },
    });
    await file.makePublic();
    
    const url = `https://storage.googleapis.com/${bucketName}/${filename}`;
    return { url, width: 1200, height: 630 };
  } catch (e) {
    console.error("Error processing image:", e);
    return null;
  }
}

async function run() {
  const collections = ['site_content_blogPosts', 'site_content_faqs', 'site_content_brideGallery', 'site_content_heritageItems', 'site_content_methodologySteps'];
  
  for (const collName of collections) {
    const snap = await db.collection(collName).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      let changed = false;
      let updates = {};
      const diffs = {};
      
      if (data.body) {
        let newBody = data.body;
        
        newBody = newBody.replace(/presented in a private viewing at the boutique\./gi, "presented at a one-on-one consultation at the boutique.");
        newBody = newBody.replace(/taken in person or via private appointment\./gi, "taken in person or by consultation appointment.");
        newBody = newBody.replace(/A private boutique appointment for selection and fitting/gi, "A one-on-one boutique consultation for selection and fitting.");

        bannedPhrases.forEach(p => { newBody = newBody.replace(p.regex, p.replacement); });
        spellings.forEach(p => { newBody = newBody.replace(p.regex, p.replacement); });
        
        if (newBody !== data.body) {
          updates.body = newBody;
          changed = true;
          diffs.body = "Updated body text to fix banned phrases / spellings.";
        }
      }
      
      if (collName === 'site_content_blogPosts') {
        if (!data.datePublished) {
          updates.datePublished = data.createdAt || new Date().toISOString();
          changed = true;
          diffs.datePublished = "Added datePublished";
        }
        
        if (!data.published) {
          updates.published = true;
          changed = true;
          diffs.published = "Set published=true";
        }

        for (const [key, metaDesc] of Object.entries(metaDescriptions)) {
          if (data.title && data.title.includes(key)) {
            if (data.metaDescription !== metaDesc) {
              updates.metaDescription = metaDesc;
              changed = true;
              diffs.metaDescription = `Set to: ${metaDesc.substring(0, 30)}...`;
            }
          }
        }
        
        if (data.featuredImage && data.featuredImage.startsWith('data:image')) {
          console.log(`Processing image for ${doc.id}`);
          const processed = await processImage(data.featuredImage, doc.id);
          if (processed) {
            updates.featuredImage = processed.url;
            updates.featuredImageWidth = processed.width;
            updates.featuredImageHeight = processed.height;
            changed = true;
            diffs.featuredImage = `Updated from base64 (len ${data.featuredImage.length}) to ${processed.url}`;
          }
        } else if (data.featuredImage === 'logo.png') {
           updates.featuredImage = FieldValue.delete();
           changed = true;
           diffs.featuredImage = 'Removed logo.png placeholder';
        }
      }
      
      if (changed) {
        await doc.ref.update(updates);
        console.log(`Updated ${collName}/${doc.id}:`, diffs);
      }
    }
  }
}

run().then(() => console.log("Done")).catch(console.error);
