const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Modify the link generation in the menu
code = code.replace(
  "href={section.id === 'home' ? '/' : `/${section.id}`}",
  "href={section.id === 'home' ? '/' : section.id === 'contact' ? '/pages/contact' : `/${section.id}`}"
);

fs.writeFileSync('src/App.tsx', code);

// Also add Contact to SECTIONS in constants.ts
let constantsCode = fs.readFileSync('src/constants.ts', 'utf8');
const contactSection = `  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Boutiques',
    description: 'Get in touch with Kirthi Diamonds.',
    index: '09 / 09',
    location: 'Kerala, India',
    image: '',
  },
];`;
constantsCode = constantsCode.replace("];", contactSection);
fs.writeFileSync('src/constants.ts', constantsCode);
