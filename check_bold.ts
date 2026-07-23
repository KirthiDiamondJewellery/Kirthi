import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import fs from "fs";
async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  snap.forEach(d => {
    const c = d.data().content || "";
    if (c.includes("\\*\\*")) {
      console.log(d.id, "has escaped asterisks!");
    }
  });
  process.exit(0);
}
main().catch(console.error);
