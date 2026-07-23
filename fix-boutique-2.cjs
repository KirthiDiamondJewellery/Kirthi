const fs = require('fs');
let code = fs.readFileSync('src/components/BoutiqueView.tsx', 'utf8');

code = code.replace(
  '{hasValidKey ? (\n                \n                {mapError ? (',
  '{hasValidKey ? (\n                mapError ? ('
);

fs.writeFileSync('src/components/BoutiqueView.tsx', code);
