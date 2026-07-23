const fs = require('fs');
let content = fs.readFileSync('src/components/FAQView.tsx', 'utf8');

// add firestore imports
content = content.replace(
  "import { motion, AnimatePresence } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';\nimport { collection, addDoc, serverTimestamp } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
);

// handleFeedback async
const targetFn = `  const handleFeedback = (idx: number, type: 'yes' | 'no') => {
    setFeedbackState(prev => ({ ...prev, [idx]: type }));
    // In a real application, we would send this data to a backend or analytics service here.
    console.log(\`Feedback recorded for FAQ "\${faqs[idx]?.question}": \${type}\`);
  };`;

const newFn = `  const handleFeedback = async (idx: number, type: 'yes' | 'no') => {
    setFeedbackState(prev => ({ ...prev, [idx]: type }));
    
    try {
      await addDoc(collection(db, "faq_feedback"), {
        question: faqs[idx]?.question,
        category: faqs[idx]?.category || "Uncategorized",
        helpful: type === 'yes',
        timestamp: serverTimestamp(),
        path: window.location.pathname
      });
      console.log(\`Feedback saved for FAQ "\${faqs[idx]?.question}": \${type}\`);
    } catch (error) {
      console.error("Error saving FAQ feedback:", error);
    }
  };`;

content = content.replace(targetFn, newFn);
fs.writeFileSync('src/components/FAQView.tsx', content, 'utf8');
console.log('FAQView updated to save feedback to firestore.');
