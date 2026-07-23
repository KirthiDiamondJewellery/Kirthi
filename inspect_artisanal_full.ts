import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const docSnap = await getDoc(doc(db, "site_content_blogPosts", "id-rw2zmcxho"));
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Artisanal Title:", data.title);
    console.log("Artisanal image:", data.image);
    console.log("Artisanal images:", data.images);
    console.log("Artisanal coverImage:", data.coverImage);
    
    // Search the content for images
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = imgRegex.exec(data.content || "")) !== null) {
      console.log("Image tag inside content:", match[0]);
    }
  } else {
    console.log("Artisanal post not found!");
  }
}

main().catch(console.error);
