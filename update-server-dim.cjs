const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /const filename = `\$\{Date\.now\(\)\}_\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 9\)\}\.\$\{format\}`;/;
const replacement = `let width = 1200;
      let height = 630;
      if (format === 'webp') {
         width = info.width;
         height = info.height;
      }
      const filename = \\\`\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}_\${width}x\${height}.\${format}\\\`;`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
