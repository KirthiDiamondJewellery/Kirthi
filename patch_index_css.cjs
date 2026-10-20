const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace('@import "tailwindcss";\n@source "../src";', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
content = content.replace('@import "tailwindcss";', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
content = content.replace('@custom-variant dark (&:where(.dark, .dark *));', '');
content = content.replace(/@theme {[\s\S]*?}/, ''); // Remove v4 theme block
fs.writeFileSync('src/index.css', content);
