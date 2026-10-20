const fs = require('fs');
let content = fs.readFileSync('src/components/MaisonView.tsx', 'utf8');
let parts = content.split('"openingHoursSpecification"');
if (parts.length === 3) {
  parts[2] = parts[2].replace('"opens": "10:00"', '"opens": "09:30"').replace('"closes": "19:00"', '"closes": "19:30"');
  content = parts.join('"openingHoursSpecification"');
  fs.writeFileSync('src/components/MaisonView.tsx', content);
}
