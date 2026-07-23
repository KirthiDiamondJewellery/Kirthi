const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const Memoized([a-zA-Z]+) = memo\(\1\);/g, 'const Memoized$1 = $1;');
fs.writeFileSync('src/App.tsx', code);
