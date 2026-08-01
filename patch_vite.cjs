const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace(
  "import viteCompression from 'vite-plugin-compression';",
  "import viteCompression from 'vite-plugin-compression';\nimport tailwindcss from '@tailwindcss/vite';"
);
content = content.replace(
  "plugins: [react(), viteCompression({ algorithm: 'gzip', ext: '.gz' })],",
  "plugins: [react(), tailwindcss(), viteCompression({ algorithm: 'gzip', ext: '.gz' })],"
);
fs.writeFileSync('vite.config.ts', content);
