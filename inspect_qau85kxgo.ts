import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const docSnap = await getDoc(doc(db, "site_content_blogPosts", "id-qau85kxgo"));
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Modern Kerala Bride Content:");
    console.log(data.content);
    console.log("Image:", data.image);
    console.log("Images:", data.images);
    console.log("Excerpt:", data.excerpt);
  } else {
    console.log("Post not found!");
  }
}

main().catch(console.error);
