const fs = require('fs');

let bv = fs.readFileSync('src/components/BoutiqueView.tsx', 'utf8');
bv = bv.replace(/10\.006519/g, '10.006514026736081');
bv = bv.replace(/11\.255732/g, '11.255769028405163');
fs.writeFileSync('src/components/BoutiqueView.tsx', bv);

let ct = fs.readFileSync('src/constants.ts', 'utf8');
ct = ct.replace(/10\.006519299657132/g, '10.006514026736081');
ct = ct.replace(/76\.31304130089853/g, '76.31314780185147');
ct = ct.replace(/11\.255732210814639/g, '11.255769028405163');
ct = ct.replace(/75\.78922851216666/g, '75.78914260997904');
fs.writeFileSync('src/constants.ts', ct);

console.log('Patched hardcoded coords');
