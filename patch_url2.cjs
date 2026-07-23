const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const urlReq = req\.originalUrl;/g, 'const url = req.originalUrl;');
code = code.replace(/vite\.transformIndexHtml\(req\.originalUrl, template\)/g, 'vite.transformIndexHtml(url, template)');
code = code.replace(/vite\.transformIndexHtml\(url, template\)/g, 'vite.transformIndexHtml(req.originalUrl, template)');

fs.writeFileSync('server.ts', code);
