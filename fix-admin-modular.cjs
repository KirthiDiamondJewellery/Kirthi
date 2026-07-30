const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

// Replace imports
s = s.replace('import admin from "firebase-admin";', 'import { initializeApp } from "firebase-admin/app";\nimport { getFirestore } from "firebase-admin/firestore";');

// Replace db init
s = s.replace('admin.initializeApp({', 'initializeApp({');
s = s.replace('db = admin.firestore();', 'db = getFirestore();');

fs.writeFileSync('server.ts', s);
