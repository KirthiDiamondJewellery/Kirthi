const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/let buffer = req.file.buffer;/, 'let buffer = req.file.buffer; console.log("File received:", req.file.originalname, req.file.mimetype, buffer.length);');
fs.writeFileSync('server.ts', code);
