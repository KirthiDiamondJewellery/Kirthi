const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

// I will completely replace the Product interface to fix it, just in case
const productRegex = /export interface Product \{[\s\S]*?\};/g;

// Instead of regexes that fail, I'll just write a script that splits by "  }," and fixes it.
// Let's just download the original constants.ts if we can?
