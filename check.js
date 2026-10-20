const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
console.log(content.indexOf('canonicalBaseUrl'));
console.log(content.indexOf('canonicalBaseUrl ='));
