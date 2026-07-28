const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace('        { path: "/contact",\n        { path: "/contact",', '        { path: "/contact",');

fs.writeFileSync('server.ts', s);
