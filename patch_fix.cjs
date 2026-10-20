const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

content = content.replace(
  /image: '',\n  }\n  {\n    id: 'bespoke'/g,
  "image: '',\n  },\n  {\n    id: 'bespoke'"
);

fs.writeFileSync('src/constants.ts', content);
