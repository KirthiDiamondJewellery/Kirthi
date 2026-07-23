import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  console.log("Fetching site_content_blogPosts...");
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  console.log(`Found ${snap.size} posts in database.`);
  snap.forEach(doc => {
    console.log(`- ID: ${doc.id}`);
    console.log(`  Title: ${doc.data().title}`);
    console.log(`  Excerpt: ${doc.data().excerpt}`);
    console.log(`  Image: ${doc.data().image}`);
    console.log(`  Content snippet: ${doc.data().content?.substring(0, 200)}...`);
  });
}

main().catch(console.error);
