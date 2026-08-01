const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

const bespokeRegex = /\{\s*id:\s*'bespoke',[\s\S]*?image:\s*'',\s*\},\s*/;
const contactRegex = /\{\s*id:\s*'contact',[\s\S]*?image:\s*'',\s*\}\s*\];/;

const bespokeStr = content.match(bespokeRegex)[0];
let contactStr = content.match(contactRegex)[0];

// Remove bespoke
content = content.replace(bespokeStr, '');
// Replace contact with bespoke + contact (or contact + bespoke)
// Wait! The user says "clicking on contact goes to bespoke and clicking on bespoke goes to contact".
// Maybe the user means something else?
