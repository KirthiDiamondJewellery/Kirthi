const fs = require('fs');
let content = fs.readFileSync('src/components/BoutiqueView.tsx', 'utf8');

content = content.replace(
  'process.env.GOOGLE_MAPS_PLATFORM_KEY ||',
  '(typeof process !== "undefined" && process.env?.GOOGLE_MAPS_PLATFORM_KEY) ||'
);

fs.writeFileSync('src/components/BoutiqueView.tsx', content);
