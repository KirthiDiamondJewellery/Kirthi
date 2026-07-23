const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const url = req\.originalUrl;/g, 'const reqUrl = req.originalUrl;');
code = code.replace(/let pathPart = url\.split\("\?"\)\[0\];/g, 'let pathPart = reqUrl.split("?")[0];');
code = code.replace(/vite\.transformIndexHtml\(url, template\)/g, 'vite.transformIndexHtml(reqUrl, template)');
code = code.replace(/vite\.transformIndexHtml\(req\.originalUrl \|\| '\/', template\)/g, 'vite.transformIndexHtml(req.originalUrl || "/", template)');

fs.writeFileSync('server.ts', code);
