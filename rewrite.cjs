const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const target = `          if (db) {
            const postsCollection = db.collection("site_content_blogPosts");
            const trendsCollection = db.collection("site_content_journalTrends");
            let snapshot = { docs: [] }; let trendsSnapshot = { docs: [] };
            try {
              snapshot = await postsCollection.get();
              trendsSnapshot = await trendsCollection.get();
            } catch (err) {
              console.error("DB Fetch Error for article:", err.message);
            }
            
            if (snapshot.docs && snapshot.docs.length > 0) {
              snapshot.forEach(doc => {
              const data = doc.data();
              const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
              if (pSlug === slug || doc.id === slug) {
                post = { id: doc.id, ...data };
              }
            });
            
            }
            if (!post) {
              if (trendsSnapshot.docs && trendsSnapshot.docs.length > 0) {
                trendsSnapshot.forEach(doc => {
                const data = doc.data();
                const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                if (pSlug === slug || doc.id === slug) {
                  post = { id: doc.id, ...data };
                  categoryName = "Trends";
                }
              });
            }
          }
            
              });
              }
            }
            if (!post) {
              const fallbackPost = hardcodedPosts.find(p => p.id === slug);`;

const replacement = `          if (db) {
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

// Wait, the target string might not match exactly due to whitespace!
// Let me use a regex to grab the whole block!
