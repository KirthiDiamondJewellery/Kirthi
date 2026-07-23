import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const BANNED_TERMS = [
  "private viewing",
  "private-viewing",
  "private concierge",
  "concierge",
  "private appointment",
  "priority access",
  "hurry",
  "limited time"
];

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const collections = ["site_content_blogPosts", "site_content_journalTrends"];

  for (const colName of collections) {
    console.log(`\nChecking collection: ${colName}`);
    const snap = await getDocs(collection(db, colName));
    console.log(`Found ${snap.size} documents.`);
    snap.forEach(doc => {
      const data = doc.data();
      const contentStr = JSON.stringify(data);
      const found = [];
      for (const term of BANNED_TERMS) {
        if (new RegExp(term, "i").test(contentStr)) {
          found.push(term);
        }
      }
      if (found.length > 0) {
        console.log(`- Document ID: ${doc.id}`);
        console.log(`  Title: ${data.title}`);
        console.log(`  Found banned terms: ${found.join(", ")}`);
      } else {
        console.log(`- Document ID: ${doc.id} (Clean)`);
      }
    });
  }
}

main().catch(console.error);
