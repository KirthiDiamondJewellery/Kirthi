const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/let quality = 0\.8;/, 'const quality = 0.8;');
code = code.replace(/let base64 = tryCompress\(width, height, quality\);/, 'const base64 = tryCompress(width, height, quality);');

fs.writeFileSync('src/components/AdminView.tsx', code);
