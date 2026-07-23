const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

// Undo the bad replacement
const badSection = `details: string[  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Boutiques',
    description: 'Get in touch with Kirthi Diamonds.',
    index: '09 / 09',
    location: 'Kerala, India',
    image: '',
  },
];`;
code = code.replace(badSection, "details: string[];");

// Now we need to append the contact section correctly to SECTIONS
// Wait, we also replaced another ]; ? Let's check how many times the contact section appears.
