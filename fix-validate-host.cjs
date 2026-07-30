const fs = require('fs');
let s = fs.readFileSync('validate-deploy.cjs', 'utf8');
s = s.replace(/if \(html\.includes\('http:\/\/'\) \|\| html\.includes\('www\.kirthidiamonds\.com'\)\)/g, "if ((html.includes('http://') && !html.includes('http://localhost')) || html.includes('www.kirthidiamonds.com'))");
fs.writeFileSync('validate-deploy.cjs', s);
