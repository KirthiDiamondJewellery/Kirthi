import { initializeApp } from "firebase/app";
import { initializeFirestore, getDocs, collection } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const collections = ["site_content_products", "site_content_categories", "site_content_collections", "site_content_blogPosts", "site_content_hero", "site_content_services", "site_content_reviews", "site_content_faq", "site_content_education", "site_content_pages", "site_content_about"];
  
  for (const c of collections) {
    try {
      const snap = await getDocs(collection(db, c));
      snap.forEach(d => {
        const str = JSON.stringify(d.data());
        if (str.toLowerCase().includes("hurry")) {
          console.log(`Found 'hurry' in ${c} / ${d.id}`);
        }
      });
    } catch (e) {
       // Ignore
    }
  }
}

main().catch(console.error);
