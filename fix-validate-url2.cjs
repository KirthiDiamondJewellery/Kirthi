const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');

s = s.replace(/const links = extractAllTags\(html, \/href=\\["'\\]\(\\\$\\{baseUrl\\}\\/journal\\/\\[\^"'\\]\+\)\\["'\\]\\/gi\);/g, 
  'const links = extractAllTags(html, new RegExp(`href=["\'](${baseUrl}/journal/[^"\']+)["\']`, "gi"));');

// Wait, the previous replace was: s.replace(/https:\/\/kirthidiamonds\.com\/journal\//g, '${baseUrl}/journal/');
// So the regex literal became /href=["'](${baseUrl}\/journal\/[^"']+)["']/gi which is INVALID syntax for a regex literal!
// We need to use `new RegExp` !

s = s.replace(/extractAllTags\(html, \/href=\\["'\\]\(\\\$\\{baseUrl\\}\\/journal\\/\\[\^"'\\]\+\)\\["'\\]\\/gi\)/g, 'extractAllTags(html, new RegExp(`href=["\'](${baseUrl}/journal/[^"\']+)["\']`, "gi"))');

fs.writeFileSync('validate-deploy.cjs', s);
