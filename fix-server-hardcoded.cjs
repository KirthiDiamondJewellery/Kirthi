const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/https:\/\/kirthidiamonds\.com\/journal/g, '${canonicalBaseUrl}/journal');
s = s.replace(/https:\/\/kirthidiamonds\.com\/shop/g, '${canonicalBaseUrl}/shop');

fs.writeFileSync('server.ts', s);
