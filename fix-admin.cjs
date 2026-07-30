const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

// Replace imports
s = s.replace('import { initializeApp } from "firebase/app";', 'import * as admin from "firebase-admin";');
s = s.replace('import { getFirestore, initializeFirestore, collection, getDocs, doc, getDoc, orderBy, query, limit, onSnapshot } from "firebase/firestore";\n', '');

// Replace db init
const initRegex = /if \(firebaseConfig\) \{[\s\S]*?firebaseConfig\.firestoreDatabaseId\);\s*\}/;
const newInit = `if (firebaseConfig) {
  try {
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
    db = admin.firestore();
    db.settings({ databaseId: firebaseConfig.firestoreDatabaseId || '(default)' });
    console.log("Firebase Admin initialized successfully with project:", firebaseConfig.projectId, "and DB:", firebaseConfig.firestoreDatabaseId || '(default)');
  } catch (e) {
    console.error("Firebase Admin initialization error:", e);
  }
}`;
s = s.replace(initRegex, newInit);

// We also need to fix `getDocs(collection(db, ...))` -> `db.collection(...).get()`
s = s.replace(/await getDocs\(collection\(db,\s*"([^"]+)"\)\)/g, 'await db.collection("$1").get()');
s = s.replace(/const snap = await getDocs\(query\(collection\(db, "([^"]+)".*?\)\)\);/g, 'const snap = await db.collection("$1").orderBy("createdAt", "desc").limit(4).get();');
s = s.replace(/const q = query\(collection\(db,\s*"([^"]+)"\), orderBy\("date", "desc"\), limit\(3\)\);\n\s*const snap = await getDocs\(q\);/g, 'const snap = await db.collection("$1").orderBy("date", "desc").limit(3).get();');

// `doc.data()` works the same in admin SDK
fs.writeFileSync('server.ts', s);
