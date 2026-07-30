const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');
s = s.replace(/console\.log\("Firebase Admin initialized successfully.*?\);/, `console.log("Firebase Admin initialized successfully with project:", firebaseConfig.projectId, "and DB:", firebaseConfig.firestoreDatabaseId || '(default)');
    console.log("Firestore database path connectivity:", db.collection("site_content_shopProducts").path);`);
fs.writeFileSync('server.ts', s);
