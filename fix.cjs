const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

const bad = `  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Boutiques',
    description: 'Get in touch with Kirthi Diamonds.',
    index: '09 / 09',
    location: 'Kerala, India',
    image: '',
  },
];`;
code = code.replace(bad, "details: string[];");
fs.writeFileSync('src/constants.ts', code);
