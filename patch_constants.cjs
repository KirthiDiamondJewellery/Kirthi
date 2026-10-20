const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

const bespokeSection = `
  {
    id: 'bespoke',
    title: 'Bespoke',
    seoTitle: 'Bespoke Diamond Commissions | Kirthi Diamonds',
    subtitle: 'Consultation',
    description: "Information on commissioning bespoke diamond and gold jewellery at Kirthi Diamonds Kochi and Calicut.",
    index: '08 / 08',
    location: 'Kerala, India',
    image: '',
  },
  {
    id: 'contact',
`;

content = content.replace(/\{\s*id:\s*'contact',/m, bespokeSection);

fs.writeFileSync('src/constants.ts', content);
