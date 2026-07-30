const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

// replace manual getDocs
s = s.replace(/const snapshot = await getDocs\(postsCollection\);/g, 'const snapshot = await postsCollection.get();');
s = s.replace(/const trendsSnapshot = await getDocs\(trendsCollection\);/g, 'const trendsSnapshot = await trendsCollection.get();');
s = s.replace(/const postsCollection = collection\(db, "([^"]+)"\);/g, 'const postsCollection = db.collection("$1");');
s = s.replace(/const trendsCollection = collection\(db, "([^"]+)"\);/g, 'const trendsCollection = db.collection("$1");');

s = s.replace(/const snap = await getDocs\(collection\(db, col\)\);/g, 'const snap = await db.collection(col).get();');
s = s.replace(/await getDocs\(collection\(db, col\)\);/g, 'await db.collection(col).get();');
s = s.replace(/const globalDoc = await getDoc\(doc\(db, "site_content", "global"\)\);/g, 'const globalDoc = await db.collection("site_content").doc("global").get();');

fs.writeFileSync('server.ts', s);
