const fs = require('fs');
let code = fs.readFileSync('src/components/BoutiqueView.tsx', 'utf8');

code = code.replace('{hasValidKey ? (\n                  \n                  {mapError ? (', '{hasValidKey ? (\n                  mapError ? (');
code = code.replace('                </APIProvider>\n                )}\n              ) : (', '                </APIProvider>\n                )\n              ) : (');

fs.writeFileSync('src/components/BoutiqueView.tsx', code);
