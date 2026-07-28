const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: \`https://\${firebaseConfig.projectId}.firebaseio.com\`
  });
}

const db = admin.firestore();

async function run() {
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

  const colRef = db.collection('site_content_faqs');
  const snapshot = await colRef.get();
  
  const existingQuestions = new Set(snapshot.docs.map(d => d.data().question));
  
  let added = 0;
  
  for (const faq of additionalFaqs) {
    if (!existingQuestions.has(faq.question)) {
      await colRef.add({ ...faq, createdAt: new Date() });
      added++;
    }
  }

  if (added > 0) {
    console.log(\`Added \${added} new FAQs\`);
  } else {
    console.log("No new FAQs needed");
  }
}

run().catch(console.error).then(() => process.exit(0));
