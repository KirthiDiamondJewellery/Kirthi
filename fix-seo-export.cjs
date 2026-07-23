const fs = require('fs');
let content = fs.readFileSync('src/utils/seo.ts', 'utf8');
content += `\nexport function injectFAQSchema(faqs: Array<{question: string, answer: string}>, id: string = "faq-schema") {
  if (!faqs || faqs.length === 0) return;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  injectSchema(schema, id);
}\n`;
fs.writeFileSync('src/utils/seo.ts', content);
