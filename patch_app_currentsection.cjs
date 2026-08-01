const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const currentSection = content\?\.\[currentIndex\] \|\| SECTIONS\[currentIndex\];/g,
  "const currentSection = (content?.sections || SECTIONS)[currentIndex];"
);

fs.writeFileSync('src/App.tsx', content);
