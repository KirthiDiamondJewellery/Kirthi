const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace const PORT = 3000; with process.env.PORT
content = content.replace(
  'const PORT = 3000;',
  'const PORT = Number(process.env.PORT) || 3000;'
);

fs.writeFileSync('server.ts', content);
