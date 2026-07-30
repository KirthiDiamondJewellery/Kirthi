const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(db\) \{\s*const postsCollection = db\.collection\("site_content_blogPosts"\);[\s\S]*?if \(!post\) \{\s*const fallbackPost = hardcodedPosts\.find\(p => p\.id === slug\);/m;

const replacement = `if (db) {
            const postsCollection = db.collection("site_content_blogPosts");
            const trendsCollection = db.collection("site_content_journalTrends");
            try {
              const snapshot = await postsCollection.get();
              snapshot.forEach(doc => {
                const data = doc.data();
                const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                if (pSlug === slug || doc.id === slug) {
                  post = { id: doc.id, ...data };
                }
              });
              if (!post) {
                const trendsSnapshot = await trendsCollection.get();
                trendsSnapshot.forEach(doc => {
                  const data = doc.data();
                  const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                  if (pSlug === slug || doc.id === slug) {
                    post = { id: doc.id, ...data };
                    categoryName = "Trends";
                  }
                });
              }
            } catch (err) {
              console.error("DB Fetch Error for article:", err.message);
            }
          }
          if (!post) {
            const fallbackPost = hardcodedPosts.find(p => p.id === slug);`;

s = s.replace(regex, replacement);
fs.writeFileSync('server.ts', s);
