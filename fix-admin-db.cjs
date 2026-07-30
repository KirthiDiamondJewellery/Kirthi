const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/db = getFirestore\(\);\s*db\.settings\(\{ databaseId: firebaseConfig\.firestoreDatabaseId \|\| '\(default\)' \}\);/, 'db = getFirestore(firebaseConfig.firestoreDatabaseId || "(default)");');

fs.writeFileSync('server.ts', s);
