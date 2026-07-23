import { initializeApp } from "firebase/app";
import { initializeFirestore, getDoc, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const d = await getDoc(doc(db, "site_content_blogPosts", "id-qau85kxgo"));
  if (d.exists()) {
    const data = d.data();
    let content = data.content;
    console.log("Original content snippet with 'hurry':", content.substring(content.toLowerCase().indexOf("hurry") - 50, content.toLowerCase().indexOf("hurry") + 50));
    content = content.replace(/hurry/gi, "act quickly");
    await updateDoc(doc(db, "site_content_blogPosts", "id-qau85kxgo"), { content });
    console.log("Fixed 'hurry'");
  }
}

main().catch(console.error);
