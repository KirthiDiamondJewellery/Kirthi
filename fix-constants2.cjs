const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

// The end of SECTIONS is the first ]; after SECTIONS definition
const regex = /export const SECTIONS: Section\[\] = \[[\s\S]*?\];/;
const match = code.match(regex);
if (match) {
  const sectionsString = match[0];
  const newSectionsString = sectionsString.replace("  },\n];", `  },\n  {\n    id: 'contact',\n    title: 'Contact',\n    subtitle: 'Boutiques',\n    description: 'Get in touch with Kirthi Diamonds.',\n    index: '09 / 09',\n    location: 'Kerala, India',\n    image: '',\n  },\n];`);
  code = code.replace(sectionsString, newSectionsString);
  fs.writeFileSync('src/constants.ts', code);
  console.log("Fixed!");
}
