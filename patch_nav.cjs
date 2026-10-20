const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
content = content.replace("import SavoirFaire from \"./components/SavoirFaire\";", "import SavoirFaire from \"./components/SavoirFaire\";\nimport BespokeView from \"./components/BespokeView\";");

const bespokeRoute = `
                  ) : currentSection.id === "bespoke" ? (
                    <BespokeView 
                      onContact={() => setCurrentSection(SECTIONS.find(s => s.id === "contact")!)} 
                      onGoHome={() => setCurrentSection(SECTIONS[0])} 
                    />
                  ) : currentSection.id === "methodology" ? (
`;
content = content.replace(/\) : currentSection\.id === "methodology" \? \(/, bespokeRoute);

fs.writeFileSync('src/App.tsx', content);

// Let's modify constants.ts to add Bespoke
let consts = fs.readFileSync('src/constants.ts', 'utf8');
consts = consts.replace(
  /{ id: 'methodology', label: 'Method' },\n  { id: 'contact', label: 'Contact' }/,
  "{ id: 'methodology', label: 'Method' },\n  { id: 'bespoke', label: 'Bespoke' },\n  { id: 'contact', label: 'Contact' }"
);
consts = consts.replace(
  /{ id: 'methodology', label: 'Methodology' },\n  { id: 'contact', label: 'Contact' }/,
  "{ id: 'methodology', label: 'Methodology' },\n  { id: 'bespoke', label: 'Bespoke' },\n  { id: 'contact', label: 'Contact' }"
);
fs.writeFileSync('src/constants.ts', consts);
