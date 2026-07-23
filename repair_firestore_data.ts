import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

async function repairData() {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);

  const postsRef = collection(db, "site_content_blogPosts");
  const snapshot = await getDocs(postsRef);

  console.log(`Found ${snapshot.docs.length} documents in site_content_blogPosts.`);

  const curatedDescriptions: Record<string, string> = {
    "id-khi962kaj": "Discover the finest Onam diamond jewellery collections in Kerala at Kirthi Diamonds. Explore GIA certified solitaires and BIS hallmarked gold at Kochi and Calicut.",
    "id-lfhdvzo46": "An exploration of artistic inspiration in bespoke diamond design. Discover how Kirthi Diamonds transforms rare stones into generational masterpieces.",
    "id-mayq3m9rg": "Comparing diamond jewellery and gold investments in Kerala. Understand liquidity, certification, and value retention for GIA certified solitaires at Kirthi Diamonds.",
    "id-o116i158q": "A comprehensive buyer's guide to GIA certification in Kochi. Learn how cut, colour, clarity, and carat weight protect your diamond investment at Kirthi Diamonds.",
    "id-qau85kxgo": "Explore how the modern Kerala bride balances traditional gold heritage with bespoke GIA certified diamond masterpieces from Kirthi Diamonds.",
    "id-ranjpvm2b": "Discover the mastery behind hand-hammering and manual stone setting. How Kirthi Diamonds crafts bespoke jewellery built to last for generations.",
    "id-rw2zmcxho": "Understand the difference between artisanal diamond jewellery and mass production. Discover the structural brilliance of bespoke crafting at Kirthi Diamonds.",
    "id-uqndmwq4b": "Why transparent crafting timelines matter when acquiring bespoke diamond jewellery in India. What to expect at every stage of creation with Kirthi Diamonds."
  };

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;
    console.log(`Checking doc ${docId}: "${data.title}"`);

    let content = data.content || "";
    let featuredImage = data.featuredImage || "";
    let title = data.title || "";

    // 1. Clean base64 images
    if (featuredImage.startsWith("data:") || featuredImage.length > 500) {
      console.log(`  Replacing base64 featuredImage in ${docId}`);
      featuredImage = "https://kirthidiamonds.com/og-cover.jpg";
    }

    // 2. Clean content string of base64 images
    if (content.includes("data:image")) {
      console.log(`  Removing inline base64 image strings from content in ${docId}`);
      content = content.replace(/!\[.*?\]\(data:image\/[a-zA-Z]+;base64,[^)]+\)/g, "");
    }

    // 3. Clean banned terms and spellings in title and content
    let updatedTitle = title
      .replace(/^#+\s*/, "")
      .replace(/\bjewelry\b/gi, "jewellery")
      .replace(/\bjewelries\b/gi, "jewelleries")
      .replace(/\bcolor\b/gi, "colour")
      .replace(/\bcolors\b/gi, "colours")
      .replace(/\bconcierge\b/gi, "bespoke consultation")
      .replace(/\bprivate viewing\b/gi, "boutique appointment")
      .replace(/\bprivate viewings\b/gi, "boutique appointments");

    let updatedContent = content
      .replace(/\bjewelry\b/gi, "jewellery")
      .replace(/\bjewelries\b/gi, "jewelleries")
      .replace(/\bcolor\b/gi, "colour")
      .replace(/\bcolors\b/gi, "colours")
      .replace(/\bconcierge\b/gi, "bespoke consultation")
      .replace(/\bprivate viewing\b/gi, "boutique appointment")
      .replace(/\bprivate viewings\b/gi, "boutique appointments")
      .replace(/!/g, "."); // Remove exclamation marks per brand rules

    // Clean double periods if created
    updatedContent = updatedContent.replace(/\.\.+/g, ".");

    // 4. Set metaDescription
    const metaDescription = curatedDescriptions[docId] || `${updatedTitle}. Explore GIA and IGI certified solitaires and bespoke diamond masterpieces at Kirthi Diamonds.`;

    const updates: any = {
      title: updatedTitle,
      content: updatedContent,
      featuredImage: featuredImage,
      metaDescription: metaDescription
    };

    // For id-lfhdvzo46 ("The Art of Jewellery Design"), enhance content if thin
    if (docId === "id-lfhdvzo46" && updatedContent.length < 500) {
      console.log("  Rewriting thin Art of Jewellery Design post in brand voice");
      updates.content = `The creation of high jewellery at Kirthi Diamonds begins not with a sketch, but with a gemstone. Founded in 2006 upon a family heritage in loose diamond sourcing dating back to 1975, our bespoke house treats every diamond as a singular work of natural art.

Finding inspiration for bespoke jewellery requires looking beyond fleeting commercial trends. Our designers draw from traditional South Indian architecture, botanical geometry, and the organic fire inherent in each conflict-free solitaire. When working with rare GIA and IGI certified diamonds, the natural crystal structure guides the mounting rather than forcing the gem into a generic pre-cast frame.

In our dedicated Kerala workshops, master bench jewellers bring these inspirations to life through low-volume, hand-hammered metallurgy and microscopic claw setting. Every piece of 18kt or 22kt gold is BIS hallmarked, guaranteeing uncompromised purity. We invite patrons to experience this creative journey firsthand at our Kochi and Calicut boutiques, where individual vision is transformed into an enduring generational heirloom.`;
    }

    await updateDoc(doc(db, "site_content_blogPosts", docId), updates);
    console.log(`  Updated doc ${docId} successfully.`);
  }

  console.log("Firestore repair completed.");
  process.exit(0);
}

repairData().catch(e => {
  console.error("Migration error:", e);
  process.exit(1);
});
