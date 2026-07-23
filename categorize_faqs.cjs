const fs = require('fs');

let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

// The faqs array starts at: faqs: [
// Let's replace the whole faqs array by parsing and adding categories

const faqRegex = /faqs: (\[[\s\S]*?\]),\n  homeFAQs:/;
const match = content.match(faqRegex);

if (match) {
  let faqs = JSON.parse(match[1]);
  
  faqs.forEach(faq => {
    if (faq.question.includes('custom') || faq.question.includes('artisanal') || faq.question.includes('traditional')) {
      faq.category = 'Bespoke & Design';
    } else if (faq.question.includes('verify') || faq.question.includes('GIA') || faq.question.includes('real') || faq.question.includes('BIS')) {
      faq.category = 'Certification & Quality';
    } else {
      faq.category = 'Purchasing & Policies';
    }
  });

  const newFaqsStr = 'faqs: ' + JSON.stringify(faqs, null, 2) + ',\n  homeFAQs:';
  content = content.replace(faqRegex, newFaqsStr);
  fs.writeFileSync('src/contexts/ContentContext.tsx', content, 'utf8');
  console.log('Categories added to faqs.');
} else {
  console.log('Could not find faqs array');
}
