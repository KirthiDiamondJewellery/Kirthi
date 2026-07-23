const fs = require('fs');
let content = fs.readFileSync('src/components/FAQView.tsx', 'utf8');

content = content.replace(
  'const faqs = content?.faqs || [];',
  'const faqs = useMemo(() => content?.faqs || [], [content?.faqs]);'
);

fs.writeFileSync('src/components/FAQView.tsx', content, 'utf8');
