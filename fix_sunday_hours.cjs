const fs = require('fs');

// 1. ContentContext.tsx
let ctx = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');
ctx = ctx.replace(/kochiHours: ".*?",/s, 'kochiHours: "Mon – Sat: 10:00 AM – 8:00 PM\\nClosed on Sundays",');
ctx = ctx.replace(/calicutHours: ".*?",/s, 'calicutHours: "Mon – Sat: 10:00 AM – 8:00 PM\\nClosed on Sundays",');
fs.writeFileSync('src/contexts/ContentContext.tsx', ctx);

// 2. SharedFooter.tsx
let footer = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');
footer = footer.replace(/Mon–Sat 10:00 AM – 8:00 PM<br\/>Sun: 10:30 AM – 1:00 PM/g, 'Mon–Sat 10:00 AM – 8:00 PM<br/>Closed on Sundays');
fs.writeFileSync('src/components/SharedFooter.tsx', footer);

// 3. PageView.tsx
let page = fs.readFileSync('src/components/PageView.tsx', 'utf8');
page = page.replace(/10:00 AM – 8:00 PM \(Sun 10:30 AM - 1:00 PM\)/g, '10:00 AM – 8:00 PM (Closed on Sundays)');
fs.writeFileSync('src/components/PageView.tsx', page);

// 4. StoreLocatorView.tsx
let store = fs.readFileSync('src/components/StoreLocatorView.tsx', 'utf8');
store = store.replace(/10:00 AM - 8:00 PM \(Sun 10:30 AM - 1:00 PM\)/g, '10:00 AM - 8:00 PM (Closed on Sundays)');
fs.writeFileSync('src/components/StoreLocatorView.tsx', store);

// 5. ContactView.tsx
let contact = fs.readFileSync('src/components/ContactView.tsx', 'utf8');
contact = contact.replace(/Mon–Sat 10:00–20:00, Sun 10:30–13:00\./g, 'Mon–Sat 10:00–20:00 (Closed on Sundays).');
fs.writeFileSync('src/components/ContactView.tsx', contact);

// 6. MaisonView.tsx
let maison = fs.readFileSync('src/components/MaisonView.tsx', 'utf8');
// Remove Sunday openingHoursSpecification entries from JSON-LD schema
maison = maison.replace(/,\s*\{\s*"@type": "OpeningHoursSpecification",\s*"dayOfWeek": "Sunday",\s*"opens": "10:30",\s*"closes": "13:00"\s*\}/g, '');
fs.writeFileSync('src/components/MaisonView.tsx', maison);

// 7. server.ts
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(/,\s*\{\s*"@type": "OpeningHoursSpecification",\s*"dayOfWeek": "Sunday",\s*"opens": "10:30",\s*"closes": "13:00"\s*\}/g, '');
fs.writeFileSync('server.ts', server);

console.log('Successfully updated Sunday hours to Closed on Sundays across all files.');
