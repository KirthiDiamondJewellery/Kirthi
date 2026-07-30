const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');
s = s.replace('extractAllTags(html, /href=["\'](${baseUrl}\\/journal\\/[^"\']+)["\']/gi)', 'extractAllTags(html, new RegExp(`href=["\\\'](${baseUrl}/journal/[^"\\\']+)["\\\']`, "gi"))');
fs.writeFileSync('validate-deploy.cjs', s);
