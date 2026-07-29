const { initializeApp } = require("firebase/app");
const { initializeFirestore, collection, getDocs, doc, updateDoc } = require("firebase/firestore");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json"));
const app = initializeApp(config);
const db = initializeFirestore(app, {}, config.firestoreDatabaseId || "(default)");

async function run() {
  try {
    const snap = await getDocs(collection(db, "site_content_blogPosts"));
    let updated = 0;
    for (const d of snap.docs) {
      const data = d.data();
      let changed = false;
      let newContent = data.content || "";
      if (newContent.toLowerCase().includes("private viewing") || newContent.toLowerCase().includes("private appointment")) {
        newContent = newContent.replace(/private viewing/gi, "bespoke consultation");
        newContent = newContent.replace(/private appointment/gi, "bespoke consultation");
        changed = true;
      }
      
      let newTitle = data.title || "";
      if (newTitle.toLowerCase().includes("private viewing") || newTitle.toLowerCase().includes("private appointment")) {
        newTitle = newTitle.replace(/private viewing/gi, "bespoke consultation");
        newTitle = newTitle.replace(/private appointment/gi, "bespoke consultation");
        changed = true;
      }

      if (changed) {
        await updateDoc(doc(db, "site_content_blogPosts", d.id), {
          content: newContent,
          title: newTitle
        });
        updated++;
      }
    }
    console.log("Success! Updated posts:", updated);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
