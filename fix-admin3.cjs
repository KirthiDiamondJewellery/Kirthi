const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

// Replace imports
s = s.replace('import * as admin from "firebase-admin";', 'import admin from "firebase-admin";');
fs.writeFileSync('server.ts', s);
