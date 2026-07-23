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
    console.log("image property length:", data.image ? data.image.length : 0);
    if (data.image) {
      console.log("image property starts with:", data.image.substring(0, 100));
    }
    
    console.log("images property:", data.images);
    console.log("coverImage property:", data.coverImage);
    
    const content = data.content || "";
    console.log("Content total length:", content.length);
    
    // Check for base64 inside content
    const base64Index = content.indexOf("data:image");
    if (base64Index !== -1) {
      console.log("Found data:image in content at index:", base64Index);
      console.log("Snippet starting at data:image:", content.substring(base64Index, base64Index + 100));
    } else {
      console.log("No 'data:image' substring found in content.");
    }

    // Let's also find all image tags or markdown images
    const matches = content.match(/<img[^>]+src="([^"]+)"/gi);
    if (matches) {
      console.log("Found img tags in content. count:", matches.length);
      for (const m of matches) {
        console.log("Img tag match:", m.substring(0, 150));
      }
    }
  } else {
    console.log("Artisanal post not found!");
  }
}

main().catch(console.error);
