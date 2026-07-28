const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/helmet\(\{[^]*?\}\)/g, 'helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false, xFrameOptions: false, crossOriginOpenerPolicy: false })');
fs.writeFileSync('server.ts', code);
