import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, getDocs, collection } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, config.firestoreDatabaseId);

  const docSnap = await getDoc(doc(db, "site_content_blogPosts", "id-dp522okjp"));
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Post ID id-dp522okjp exists!");
    console.log("Title:", data.title);
    console.log("Slug would be:", (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  } else {
    console.log("Post ID id-dp522okjp does NOT exist!");
  }

  // List all posts to see if any title matches GIA vs IGI
  const snap = await getDocs(collection(db, "site_content_blogPosts"));
  console.log("Total posts in site_content_blogPosts:", snap.size);
  snap.forEach(d => {
    const data = d.data();
    console.log(`- ID: ${d.id}, Title: ${data.title}`);
  });
}

main().catch(console.error);
