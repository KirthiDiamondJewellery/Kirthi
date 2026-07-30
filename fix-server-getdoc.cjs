const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/const docSnap = await getDoc\(doc\(db, "site_content", "global"\)\);/g, 'const docSnap = await db.collection("site_content").doc("global").get();');

fs.writeFileSync('server.ts', s);
