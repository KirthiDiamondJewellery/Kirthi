const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');

const target = 'const links = extractAllTags(html, /href=["\'](https:\\/\\/kirthidiamonds\\.com\\/journal\\/[^"\']+)["\']/gi);';
const replacement = 'const links = extractAllTags(html, new RegExp(`href=["\'](${baseUrl}/journal/[^"\']+)["\']`, "gi"));';

s = s.replace(target, replacement);

fs.writeFileSync('validate-deploy.cjs', s);
