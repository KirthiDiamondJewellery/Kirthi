const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(
  "const slug = d.id || (d.title ? d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');",
  "const slug = d.title ? d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : doc.id;"
);

// We should also fetch journal trends here if they exist, but for now we just fix the slug.
// Wait, is there any other place where `slug = d.id ||` is used? Let's check.
fs.writeFileSync('server.ts', s);
