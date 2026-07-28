const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const regex = /\|-\$\)\+\/g, ''\) : doc\.id;/g;
s = s.replace(regex, '');

fs.writeFileSync('server.ts', s);
