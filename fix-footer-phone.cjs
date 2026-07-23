const fs = require('fs');

let footer = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');

footer = footer.replace(/\[KOCHI_PHONE\]/g, '+919847086990');
footer = footer.replace(/\[CALICUT_PHONE\]/g, '+919847086990');
footer = footer.replace(/\[PHONE_NUMBER\]/g, '+919847086990');

fs.writeFileSync('src/components/SharedFooter.tsx', footer);
console.log('Fixed phone numbers in SharedFooter.tsx');
