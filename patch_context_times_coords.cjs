const fs = require('fs');
let code = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

code = code.replace(/kochiHours: ".*?",/s, 'kochiHours: "Mon – Sat: 10:00 AM – 8:00 PM\\nSun: 10:30 AM – 1:00 PM",');
code = code.replace(/kochiLat: .*?,/, 'kochiLat: 10.006514026736081,');
code = code.replace(/kochiLng: .*?,/, 'kochiLng: 76.31314780185147,');

code = code.replace(/calicutHours: ".*?",/s, 'calicutHours: "Mon – Sat: 10:00 AM – 8:00 PM\\nSun: 10:30 AM – 1:00 PM",');
code = code.replace(/calicutLat: .*?,/, 'calicutLat: 11.255769028405163,');
code = code.replace(/calicutLng: .*?,/, 'calicutLng: 75.78914260997904,');

fs.writeFileSync('src/contexts/ContentContext.tsx', code);
console.log('Patched ContentContext');
