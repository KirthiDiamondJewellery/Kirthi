const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');

s = s.replace(/const links = extractAllTags\(html, \/href=\\["'\\]\(https:\\\/\\\/kirthidiamonds\\.com\\\/journal\\/\\[\^"'\\]\+\)\\["'\\]\\/gi\);/, 'const links = extractAllTags(html, new RegExp(`href=["\\\'](${baseUrl}/journal/[^"\\\']+)["\\\']`, "gi"));');

fs.writeFileSync('validate-deploy.cjs', s);
