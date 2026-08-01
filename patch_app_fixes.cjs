const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove special contact block
content = content.replace(
  /} else if \(pathname === "\/contact" \|\| pathname === "\/contact\/"\) {\n\s*setViewMode\("app"\);\n\s*window\.history\.replaceState\(null, "", "\/contact"\);\n\s*/,
  ""
);

// Remove the hardcoded bespoke override
content = content.replace(
  /if \(sectionId === "bespoke"\) sectionId = "brides";\n\s*/,
  ""
);

// We should also look for anything else messing with bespoke or brides.
// Wait! `const newPath = currentSection.id === 'home' ? '/' : (currentSection.id === 'brides' ? '/bespoke' : \`/\${currentSection.id}\`);`
content = content.replace(
  /const newPath = currentSection\.id === 'home' \? '\/' : \(currentSection\.id === 'brides' \? '\/bespoke' : `\/\$\{currentSection\.id\}`\);/,
  "const newPath = currentSection.id === 'home' ? '/' : `/${currentSection.id}`;"
);

fs.writeFileSync('src/App.tsx', content);
