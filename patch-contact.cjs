const fs = require('fs');

let constants = fs.readFileSync('src/constants.ts', 'utf8');

const contactSection = `  },
  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Appointments',
    description: 'Book a bespoke consultation with our diamond specialists in Kochi or Calicut.',
    index: '07 / 08',
    location: 'Boutiques',
    image: '',
  }
];`;

constants = constants.replace(/  \}\n\];/, contactSection);
fs.writeFileSync('src/constants.ts', constants);
console.log('Added contact to SECTIONS');
