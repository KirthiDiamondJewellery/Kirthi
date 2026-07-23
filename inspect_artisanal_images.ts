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
    console.log("Artisanal post image:", data.image);
    console.log("Artisanal post images:", data.images);
    console.log("Artisanal post coverImage:", data.coverImage);
    console.log("Artisanal post content contains base64 images? ", data.content?.includes("data:image"));
    
    // Find all img tags in the content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = imgRegex.exec(data.content || "")) !== null) {
      console.log("Found img src in content:", match[1]);
    }
  } else {
    console.log("Artisanal post not found!");
  }
}

main().catch(console.error);
