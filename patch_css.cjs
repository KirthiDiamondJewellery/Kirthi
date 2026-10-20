const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n@source "../src";');
fs.writeFileSync('src/index.css', content);
