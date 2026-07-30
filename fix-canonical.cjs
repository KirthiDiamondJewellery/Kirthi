const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');
s = s.replace(/const canonicalBaseUrl = 'https:\/\/kirthidiamonds\.com';/g, "const canonicalBaseUrl = process.env.BASE_URL || 'https://kirthidiamonds.com';");
fs.writeFileSync('server.ts', s);
