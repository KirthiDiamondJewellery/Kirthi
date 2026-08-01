const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /\{SECTIONS\.map\(\(section, idx\) => \(/g,
  "{(content?.sections || SECTIONS).map((section, idx) => ("
);

content = content.replace(
  /SECTIONS\.findIndex\(\(s\) => s\.isShop\)/g,
  "(content?.sections || SECTIONS).findIndex((s) => s.isShop)"
);

content = content.replace(
  /SECTIONS\.length/g,
  "(content?.sections || SECTIONS).length"
);

fs.writeFileSync('src/App.tsx', content);
