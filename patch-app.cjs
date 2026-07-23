const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ Dynamically generate and inject the FAQ Page schema markup for index\.html on load[\s\S]*?injectFAQSchema\(homeFAQs, "dynamic-faq-schema"\);\n  \}, \[\]\);/;

content = content.replace(regex, `// Dynamically generate and inject the FAQ Page schema markup for index.html on load
  useEffect(() => {
    if (content?.homeFAQs) {
      injectFAQSchema(content.homeFAQs, "dynamic-faq-schema");
    }
  }, [content?.homeFAQs]);`);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('patched App.tsx');
