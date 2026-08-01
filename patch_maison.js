const fs = require('fs');
let content = fs.readFileSync('src/components/MaisonView.tsx', 'utf8');

// The second store is Calicut. It starts around line 135
// Let's replace the opens and closes for the second one only.
let parts = content.split('"openingHoursSpecification"');
if (parts.length === 3) {
  // parts[2] is Calicut's hours
  parts[2] = parts[2].replace('"opens": "10:00"', '"opens": "09:30"').replace('"closes": "19:00"', '"closes": "19:30"');
  content = parts.join('"openingHoursSpecification"');
  fs.writeFileSync('src/components/MaisonView.tsx', content);
}
