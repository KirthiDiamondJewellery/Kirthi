const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

// Add to the top of injectSEO
s = s.replace(/async function injectSEO\(html: string, pathPart: string\): Promise<string> \{/, `async function injectSEO(html: string, pathPart: string): Promise<string> {
    const canonicalBaseUrl = process.env.BASE_URL || 'https://kirthidiamonds.com';`);

fs.writeFileSync('server.ts', s);
