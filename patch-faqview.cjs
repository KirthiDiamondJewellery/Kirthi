const fs = require('fs');

let content = fs.readFileSync('src/components/FAQView.tsx', 'utf8');

// Add import
content = content.replace(
  "import { db } from '../lib/firebase';",
  "import { db } from '../lib/firebase';\nimport { injectFAQSchema } from '../utils/seo';"
);

// Add useEffect
const useEffectRegex = /useEffect\(\(\) => \{\s*document\.title = "Frequently Asked Questions \| Kirthi Diamonds";[\s\S]*?\}, \[\]\);/;

const useEffectReplacement = `useEffect(() => {
    document.title = "Frequently Asked Questions | Kirthi Diamonds";
    
    // Description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Find answers to frequently asked questions about diamond jewellery in Kochi, GIA and IGI certification, boutique locations, and buyback policies.";
    if (metaDescription) metaDescription.setAttribute("content", descContent);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", descContent);
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", descContent);
    
    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', 'https://kirthidiamonds.com/faq');
  }, []);

  useEffect(() => {
    if (filteredFaqs && filteredFaqs.length > 0) {
      // Use injectFAQSchema with bypassPathCheck = true because this is the /faq route
      injectFAQSchema(filteredFaqs, "faq-page-schema", true);
    }
  }, [filteredFaqs]);`;

content = content.replace(useEffectRegex, useEffectReplacement);

// Remove the static script block
const scriptRegex = /<script type="application\/ld\+json" dangerouslySetInnerHTML={{ __html: JSON\.stringify\({\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage",\s*"@id": "https:\/\/kirthidiamonds\.com\/faq#new",\s*"mainEntity": faqs\.map\(\(faq: any\) => \(\{[\s\S]*?\}\)\)\s*}\) }} \/>/;

content = content.replace(scriptRegex, '');

fs.writeFileSync('src/components/FAQView.tsx', content, 'utf8');
console.log('FAQView.tsx updated');
