const { initializeApp } = require("firebase/app");
const { initializeFirestore, collection, getDocs, doc, updateDoc } = require("firebase/firestore");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json"));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId || "(default)");

const bannedRegex = /private viewing|private-viewing|concierge|private concierge|private appointment|priority access|hurry|limited time|don't miss|offer ends/gi;

function replaceBanned(text) {
  if (!text) return text;
  let newText = text;
  newText = newText.replace(/and presented in a private viewing at the boutique\./gi, "and presented at a quiet unveiling at the boutique.");
  newText = newText.replace(/bespoke commissions are taken in person or via private appointment\./gi, "bespoke commissions are taken in person or by appointment.");
  newText = newText.replace(/This is held in our private appointment space at Kochi or Calicut\./gi, "This is held in a reserved consultation space at our Kochi or Calicut boutique.");
  
  // Generic replacements for remaining matches
  newText = newText.replace(/private viewing|private-viewing/gi, "bespoke consultation");
  newText = newText.replace(/private concierge|concierge/gi, "design team");
  newText = newText.replace(/private appointment/gi, "bespoke consultation");
  newText = newText.replace(/priority access/gi, "early consideration");
  newText = newText.replace(/hurry|don't miss|offer ends|limited time/gi, "");
  
  return newText;
}

async function run() {
  const collections = ["site_content_blogPosts", "site_content_shopProducts", "site_content_heritageItems", "site_content_journalTrends"];
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    for (const d of snap.docs) {
      const data = d.data();
      let changed = false;
      const updates = {};
      
      for (const key of Object.keys(data)) {
        if (typeof data[key] === 'string' && bannedRegex.test(data[key])) {
          const newText = replaceBanned(data[key]);
          if (newText !== data[key]) {
            updates[key] = newText;
            changed = true;
          }
        }
      }
      
      if (changed) {
        await updateDoc(doc(db, col, d.id), updates);
        console.log(`Updated ${d.id} in ${col}`);
      }
    }
  }
  
  const globalDoc = await getDocs(collection(db, "site_content"));
  for (const d of globalDoc.docs) {
      if (d.id === "global") {
          const data = d.data();
          let changed = false;
          const updates = {};
          
          if (data.sections) {
              const newSections = data.sections.map(sec => {
                  let secChanged = false;
                  const newSec = {...sec};
                  if (typeof newSec.description === 'string' && bannedRegex.test(newSec.description)) {
                      newSec.description = replaceBanned(newSec.description);
                      secChanged = true;
                  }
                  if (typeof newSec.seoDescription === 'string' && bannedRegex.test(newSec.seoDescription)) {
                      newSec.seoDescription = replaceBanned(newSec.seoDescription);
                      secChanged = true;
                  }
                  if (secChanged) changed = true;
                  return newSec;
              });
              if (changed) updates.sections = newSections;
          }
          
          if (changed) {
              await updateDoc(doc(db, "site_content", d.id), updates);
              console.log(`Updated global sections`);
          }
      }
  }
  
  process.exit(0);
}
run();
