import { initializeApp } from "firebase/app";
import { initializeFirestore, getDocs, collection, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  for (const d of snap.docs) {
    const data = d.data();
    let updated = false;
    const updates: any = {};
    if (data.coverImage && data.coverImage.startsWith("data:image")) {
      console.log("Removing base64 coverImage from", d.id);
      updates.coverImage = "";
      updated = true;
    }
    if (data.image && data.image.startsWith("data:image")) {
      console.log("Removing base64 image from", d.id);
      updates.image = "";
      updated = true;
    }
    if (data.content && data.content.includes("data:image")) {
      console.log("Found base64 in content of", d.id);
      // Let's strip base64 from content
      updates.content = data.content.replace(/src="data:image[^"]+"/g, 'src=""');
      updated = true;
    }
    
    if (updated) {
      console.log("Updating post", d.id);
      await updateDoc(doc(db, "site_content_blogPosts", d.id), updates);
    }
  }
}

main().catch(console.error);
