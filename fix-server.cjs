const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const filename = \\`\$\{Date\.now\(\)\}_\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 9\)\}_\$\{width\}x\$\{height\}\.\$\{format\}\\`;/, "const filename = `\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}_\${width}x\${height}.\${format}`;");

fs.writeFileSync('server.ts', code);
