const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');
file = file.replace('if (pathPart === "/faq") {', 'if (pathPart === "/faq" || pathPart === "/methodology") {');
fs.writeFileSync('server.ts', file);
