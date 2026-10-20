const fs = require('fs');
let content = fs.readFileSync('src/components/BoutiqueView.tsx', 'utf8');

content = content.replace(
  'const hours = isKochi ? "Mon – Sat: 10:00am – 7:30pm\\nClosed on Sundays" : "Mon – Sat: 10:00am – 7:30pm\\nClosed on Sundays";',
  'const hours = isKochi ? "Mon – Sat: 10:00 – 19:00\\nClosed on Sundays" : "Mon – Sat: 09:30 – 19:30\\nClosed on Sundays";'
);
content = content.replace(
  'const phone = "+91 98470 86990";',
  'const phone = isKochi ? "+91 98470 86990" : "+91 98470 86002";'
);
content = content.replace(
  'const schemaOpens = "10:00";',
  'const schemaOpens = isKochi ? "10:00" : "09:30";'
);
content = content.replace(
  'const schemaCloses = "19:30";',
  'const schemaCloses = isKochi ? "19:00" : "19:30";'
);

fs.writeFileSync('src/components/BoutiqueView.tsx', content);
