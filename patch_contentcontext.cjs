const fs = require('fs');
let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

// Fix hours
content = content.replace(/10:00am to 7:00pm/g, "10:00 to 19:00");
content = content.replace(/10:00am–7:00pm/g, "10:00–19:00");
content = content.replace(/10am–7:30pm/g, "10:00–19:00");
content = content.replace(/10:00am–7:30pm/g, "09:30–19:30"); // This was likely Calicut's error
content = content.replace(/09:30am–7:30pm/g, "09:30–19:30");
content = content.replace(/10:00 AM – 7:00 PM/g, "10:00–19:00");

// The prompt specifies: "Kochi: Mon–Sat 10:00–19:00 (Closed Sunday). Calicut: Mon–Sat 09:30–19:30 (Closed Sunday)"
content = content.replace(
  'Mon – Sat: 10:00–19:00\\nClosed on Sundays',
  'Mon–Sat 10:00–19:00 (Closed Sunday)'
);
content = content.replace(
  'kochiHours: "Mon – Sat: 10:00–19:00\\nClosed on Sundays"',
  'kochiHours: "Mon–Sat 10:00–19:00 (Closed Sunday)"'
);
content = content.replace(
  'calicutHours: "Mon – Sat: 09:30–19:30\\nClosed on Sundays"',
  'calicutHours: "Mon–Sat 09:30–19:30 (Closed Sunday)"'
);

fs.writeFileSync('src/contexts/ContentContext.tsx', content);
