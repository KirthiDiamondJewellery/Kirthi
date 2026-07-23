import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const docs = [
    { id: "id-khdjfej42", name: "Antique Designs" },
    { id: "id-qau85kxgo", name: "Modern Kerala Bride" },
    { id: "id-rw2zmcxho", name: "Artisanal vs Mass-Produced" }
  ];

  for (const item of docs) {
    const docSnap = await getDoc(doc(db, "site_content_blogPosts", item.id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const content = data.content || "";
      console.log(`\n========================================`);
      console.log(`DOC ID: ${item.id} (${item.name})`);
      console.log(`Title: ${data.title}`);
      
      // Find sentences containing banned keywords
      const terms = ["private viewing", "private appointment", "concierge", "priority access", "hurry", "limited time"];
      for (const term of terms) {
        const regex = new RegExp(`[^.?!]*\\b${term}\\b[^.?!]*[.?!]`, "gi");
        let match;
        while ((match = regex.exec(content)) !== null) {
          console.log(`  - Found "${term}": ${match[0].trim()}`);
        }
      }
    }
  }
}

main().catch(console.error);
