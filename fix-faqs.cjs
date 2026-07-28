const fs = require('fs');

let fileContent = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

const additionalFaqs = `,
  {
    "question": "Is Kirthi bridal jewellery custom-made?",
    "answer": "Yes. Each Kirthi bridal piece can be created through a private bespoke consultation, where our team helps refine the diamond, setting, silhouette, and finishing details around your ceremony and personal style.",
    "category": "Bespoke & Design"
  },
  {
    "question": "Does Kirthi offer lifetime buyback and exchange?",
    "answer": "Yes. Every Kirthi bridal creation is supported by a written lifetime buyback and exchange policy, documented clearly at purchase for long-term transparency.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "How is a Kirthi bridal piece valued in the future?",
    "answer": "Kirthi-certified diamonds are assessed with reference to their original certificate and prevailing valuation terms. Gold is exchanged against weight and the prevailing gold rate.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "Why choose Kirthi for bridal jewellery in Kerala?",
    "answer": "Kirthi combines family diamond heritage since 1975, private bridal consultations, certified natural diamonds, BIS hallmarked gold, and a written lifetime buyback and exchange promise. Each piece is created not only for the wedding day, but for the generations that follow.",
    "category": "Bespoke & Design"
  }
  `;

// Let's insert at the end of the faqs array
// Find the end of faqs array by finding `    "category": "Kerala Traditions"\n  },` or just replacing the last `}` in the faqs array.

// A safer way is to just do a string replacement on a known element.
const searchTarget = `    "category": "Kerala Traditions"
  }`;
fileContent = fileContent.replace(searchTarget, searchTarget + additionalFaqs);

fs.writeFileSync('src/contexts/ContentContext.tsx', fileContent);

