import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";
async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);
  const snap = await getDoc(doc(db, "site_content_blogPosts", "id-qau85kxgo"));
  console.log(snap.data().content);
  process.exit(0);
}
main().catch(console.error);
