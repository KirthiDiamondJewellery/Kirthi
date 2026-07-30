const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');

s = s.replace(/const baseUrl = 'https:\/\/kirthidiamonds\.com';/g, "const baseUrl = process.env.BASE_URL || 'https://kirthidiamonds.com';");
s = s.replace(/const urls = \["https:\/\/kirthidiamonds\.com\/".*?\];/g, 'const urls = [baseUrl + "/", baseUrl + "/shop", baseUrl + "/journal", baseUrl + "/brides", baseUrl + "/heritage", baseUrl + "/methodology", baseUrl + "/maison"];');
s = s.replace(/https:\/\/kirthidiamonds\.com\/journal\//g, '${baseUrl}/journal/');

fs.writeFileSync('validate-deploy.cjs', s);
