const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Find this block:
/*
  // Dynamically generate and inject the FAQ Page schema markup for index.html on load
  useEffect(() => {
    if (content?.homeFAQs) {
      injectFAQSchema(content.homeFAQs, "dynamic-faq-schema");
    }
  }, [content?.homeFAQs]);
*/
const blockRegex = /\/\/ Dynamically generate and inject the FAQ Page schema markup[\s\S]*?\}, \[content\?\.homeFAQs\]\);\n\n/;

appContent = appContent.replace(blockRegex, '');
fs.writeFileSync('src/App.tsx', appContent);
console.log("Removed FAQ inject useEffect.");
