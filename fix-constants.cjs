const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

// Find the index of the first ]; that we replaced, which was likely the end of SECTIONS
// Actually I replaced all occurrences of ]; with the contact section...
// Let's just fix it manually
