const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
code = code.replace(/const quality = 0\.8;/, 'const quality = 0.95;');
code = code.replace(/const MAX_WIDTH = 2500;\s*const MAX_HEIGHT = 2500;/, 'const MAX_WIDTH = 3000;\n        const MAX_HEIGHT = 3000;');
fs.writeFileSync('src/components/AdminView.tsx', code);
