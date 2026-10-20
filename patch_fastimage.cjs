const fs = require('fs');
let content = fs.readFileSync('src/components/FastImage.tsx', 'utf8');
content = content.replace(
  "const isUnsplash = src && (src.includes('unsplash.com') || src.includes('images.unsplash'));\n  if (!src || src.trim() === '' || isUnsplash) {",
  "if (!src || src.trim() === '') {"
);
fs.writeFileSync('src/components/FastImage.tsx', content);
