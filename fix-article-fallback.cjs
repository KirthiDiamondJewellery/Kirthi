const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/const snapshot = await postsCollection\.get\(\);\n\s*const trendsSnapshot = await trendsCollection\.get\(\);/g, 
`let snapshot = { docs: [] }; let trendsSnapshot = { docs: [] };
            try {
              snapshot = await postsCollection.get();
              trendsSnapshot = await trendsCollection.get();
            } catch (err) {
              console.error("DB Fetch Error for article:", err.message);
            }
`);

s = s.replace(/snapshot\.forEach\(doc => \{/g, `
            if (snapshot.docs && snapshot.docs.length > 0) {
              snapshot.forEach(doc => {`);
              
s = s.replace(/if \(!post\) \{\n\s*trendsSnapshot\.forEach\(doc => \{/g, `
            }
            if (!post) {
              if (trendsSnapshot.docs && trendsSnapshot.docs.length > 0) {
                trendsSnapshot.forEach(doc => {`);

s = s.replace(/if \(!post\) \{\n\s*const fallbackPost = hardcodedPosts\.find\(p => p\.id === slug\);/g, `
                });
              }
            }
            if (!post) {
              const fallbackPost = hardcodedPosts.find(p => p.id === slug);`);
              
fs.writeFileSync('server.ts', s);
