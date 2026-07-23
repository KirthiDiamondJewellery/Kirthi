const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const url = req\.originalUrl;/g, 'const urlReq = req.originalUrl;');
code = code.replace(/vite\.transformIndexHtml\(url, template\)/g, 'vite.transformIndexHtml(req.originalUrl, template)');

fs.writeFileSync('server.ts', code);
