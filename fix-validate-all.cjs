const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');
s = s.replace(/\(\\\$\\{baseUrl\\}\\/g, 'https://kirthidiamonds.com');
s = s.replace(/extractAllTags\(html, \/href=\\["'\\]\(https:\\\/\\\/kirthidiamonds\\.com\\\/journal\\/\\[\^"'\\]\+\)\\["'\\]\\/gi\)/g, 'extractAllTags(html, new RegExp(`href=["\\\'](${baseUrl}/journal/[^"\\\']+)["\\\']`, "gi"))');
fs.writeFileSync('validate-deploy.cjs', s);
