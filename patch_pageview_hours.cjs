const fs = require('fs');
let content = fs.readFileSync('src/components/PageView.tsx', 'utf8');

// Replace all occurrences of old times
content = content.replace(/10:00am to 7:00pm/g, "10:00–19:00");
content = content.replace(/10:00am – 7:30pm/g, "10:00–19:00");
content = content.replace(/10:00 AM – 7:00 PM/g, "10:00–19:00");

fs.writeFileSync('src/components/PageView.tsx', content);
