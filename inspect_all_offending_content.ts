import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  // 1. Inspect Modern Kerala Bride
  console.log("--- Modern Kerala Bride (id-qau85kxgo) ---");
  const brideSnap = await getDoc(doc(db, "site_content_blogPosts", "id-qau85kxgo"));
  if (brideSnap.exists()) {
    const data = brideSnap.data();
    const content = data.content || "";
    // Find all occurrences of "hurry"
    const regex = /.{0,40}\bhurry\b.{0,40}/gi;
    let match;
    let found = false;
    while ((match = regex.exec(content)) !== null) {
      console.log(`FOUND "hurry": ...${match[0]}...`);
      found = true;
    }
    if (!found) {
      console.log("No exact word boundary 'hurry' found in content. Checking substring:");
      const idx = content.toLowerCase().indexOf("hurry");
      if (idx !== -1) {
        console.log(`FOUND 'hurry' as substring around: ...${content.substring(idx - 40, idx + 45)}...`);
      }
    }
  }

  // 2. Inspect Artisanal
  console.log("\n--- Artisanal (id-rw2zmcxho) ---");
  const artSnap = await getDoc(doc(db, "site_content_blogPosts", "id-rw2zmcxho"));
  if (artSnap.exists()) {
    const data = artSnap.data();
    console.log("Artisanal title:", data.title);
    console.log("Artisanal image:", data.image);
    console.log("Artisanal images:", data.images);
    console.log("Artisanal coverImage:", data.coverImage);
    
    // Find all img tags in the content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(data.content || "")) !== null) {
      console.log("Found img tag src in content:", match[1]);
    }
  }
}

main().catch(console.error);
