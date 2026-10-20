const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/10:00-19:00/g, "10:00–19:00");
content = content.replace(/09:30-19:30/g, "09:30–19:30");

fs.writeFileSync('src/App.tsx', content);
