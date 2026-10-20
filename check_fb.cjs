const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync('.env.example', 'utf8').match(/FIREBASE_SERVICE_ACCOUNT_KEY="(.*?)"/)?.[1] || "{}"); // This might fail, let's just write a generic script that connects to the emulator if any, or use the client SDK with the config in firebase.ts.
