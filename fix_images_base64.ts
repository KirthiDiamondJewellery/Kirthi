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
    if (data.images && Array.isArray(data.images)) {
      const newImages = data.images.map((img: string) => {
        if (img && img.startsWith("data:image")) {
          console.log("Removing base64 from images array in", d.id);
          updated = true;
          return "";
        }
        return img;
      });
      if (updated) {
         updates.images = newImages;
      }
    }
    
    if (updated) {
      console.log("Updating post", d.id);
      await updateDoc(doc(db, "site_content_blogPosts", d.id), updates);
    }
  }
}

main().catch(console.error);
