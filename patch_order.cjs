const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

const bespokeBlock = `  {
    id: 'bespoke',
    title: 'Bespoke',
    seoTitle: 'Bespoke Diamond Commissions | Kirthi Diamonds',
    subtitle: 'Consultation',
    description: "Information on commissioning bespoke diamond and gold jewellery at Kirthi Diamonds Kochi and Calicut.",
    index: '08 / 08',
    location: 'Kerala, India',
    image: '',
  },`;

const contactBlock = `  {
    id: 'contact',

    title: 'Contact',
    subtitle: 'Appointments',
    description: 'Book a bespoke consultation with our diamond specialists in Kochi or Calicut.',
    index: '07 / 08',
    location: 'Boutiques',
    image: '',
  }`;

// Let's swap their order in the file
content = content.replace(bespokeBlock + '\n' + contactBlock, contactBlock + '\n' + bespokeBlock);
fs.writeFileSync('src/constants.ts', content);
