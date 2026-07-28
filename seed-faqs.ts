import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, collection, addDoc, getDocs, writeBatch, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";

async function run() {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);

  const additionalFaqs = [
    {
      question: "Is Kirthi bridal jewellery custom-made?",
      answer: "Yes. Each Kirthi bridal piece can be created through a private bespoke consultation, where our team helps refine the diamond, setting, silhouette, and finishing details around your ceremony and personal style.",
      category: "Bespoke & Design"
    },
    {
      question: "Does Kirthi offer lifetime buyback and exchange?",
      answer: "Yes. Every Kirthi bridal creation is supported by a written lifetime buyback and exchange policy, documented clearly at purchase for long-term transparency.",
      category: "Purchasing & Policies"
    },
    {
      question: "How is a Kirthi bridal piece valued in the future?",
      answer: "Kirthi-certified diamonds are assessed with reference to their original certificate and prevailing valuation terms. Gold is exchanged against weight and the prevailing gold rate.",
      category: "Purchasing & Policies"
    },
    {
      question: "Why choose Kirthi for bridal jewellery in Kerala?",
      answer: "Kirthi combines family diamond heritage since 1975, private bridal consultations, certified natural diamonds, BIS hallmarked gold, and a written lifetime buyback and exchange promise. Each piece is created not only for the wedding day, but for the generations that follow.",
      category: "Bespoke & Design"
    }
  ];

  const faqsRef = collection(db, 'site_content_faqs');
  const snapshot = await getDocs(faqsRef);
  
  // We'll check if they already exist
  const existingQuestions = new Set(snapshot.docs.map(d => d.data().question));
  
  const batch = writeBatch(db);
  let added = 0;
  
  for (const faq of additionalFaqs) {
    if (!existingQuestions.has(faq.question)) {
      const newRef = doc(faqsRef);
      batch.set(newRef, { ...faq, createdAt: new Date() });
      added++;
    }
  }

  if (added > 0) {
    await batch.commit();
    console.log(`Added ${added} new FAQs`);
  } else {
    console.log("No new FAQs needed");
  }
}
run().catch(console.error).then(() => process.exit(0));
