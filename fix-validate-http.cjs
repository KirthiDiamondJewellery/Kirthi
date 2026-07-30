const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');

s = s.replace(/const https = require\('https'\);/, "const https = require('https');\nconst http = require('http');");
s = s.replace(/https\.get\(url, \(res\) => \{/g, "const client = url.startsWith('http://') ? http : https;\n    client.get(url, (res) => {");

fs.writeFileSync('validate-deploy.cjs', s);
