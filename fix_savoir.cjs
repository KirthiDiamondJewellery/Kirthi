const fs = require('fs');
let code = fs.readFileSync('src/components/SavoirFaire.tsx', 'utf8');

code = code.replace(/const \{ content \} = useContent\(\);\s*const \{ content \} = useContent\(\);/, 'const { content } = useContent();');

fs.writeFileSync('src/components/SavoirFaire.tsx', code);
