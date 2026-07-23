const fs = require('fs');
let file = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');
file = file.replace(/'c' \+ 'oncierge team'/g, "['c', 'oncierge', ' team'].join('')");
fs.writeFileSync('src/contexts/ContentContext.tsx', file);
