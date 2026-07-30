const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');

s = s.replace(/const urls = \['\/', '\/shop', '\/journal', '\/brides', '\/heritage', '\/methodology', '\/maison'\];/, 'const urls = ["https://kirthidiamonds.com/", "https://kirthidiamonds.com/shop", "https://kirthidiamonds.com/journal", "https://kirthidiamonds.com/brides", "https://kirthidiamonds.com/heritage", "https://kirthidiamonds.com/methodology", "https://kirthidiamonds.com/maison"];');

fs.writeFileSync('validate-deploy.cjs', s);
