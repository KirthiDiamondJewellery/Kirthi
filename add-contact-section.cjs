const fs = require('fs');
let file = fs.readFileSync('src/constants.ts', 'utf8');

const contactSection = `
  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Enquiries',
    description: 'Reach out to our one-on-one bespoke consultation for bespoke commissions, viewing appointments at our exclusive boutiques, and customer support.',
    index: '07 / 08',
    location: 'Kerala',
    image: '',
  }
`;

// Insert it before the end of the SECTIONS array
file = file.replace(/\];\nexport const HERITAGE_ITEMS/, ',\n' + contactSection.trim() + '\n];\nexport const HERITAGE_ITEMS');
fs.writeFileSync('src/constants.ts', file);
