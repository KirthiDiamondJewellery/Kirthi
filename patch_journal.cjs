const fs = require('fs');
let content = fs.readFileSync('src/components/JournalView.tsx', 'utf8');
content = content.replace(
  "if (gridImgSrc.includes('unsplash.com') || gridImgSrc.includes('images.unsplash')) {\n                          gridImgSrc = \"/logo.png\";\n                        }",
  ""
);
fs.writeFileSync('src/components/JournalView.tsx', content);
