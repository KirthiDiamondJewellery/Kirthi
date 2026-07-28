const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const regex = /let postSlugs: string\[\] = \[\];[\s\S]*?if \(postSlugs\.length === 0\) \{/;

const replacement = `    let postSlugs: string[] = [];
    if (db) {
      try {
        const postsSnap = await getDocs(collection(db, "site_content_blogPosts"));
        postsSnap.forEach(doc => {
          const d = doc.data();
          const slug = d.title ? d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : doc.id;
          if (slug) postSlugs.push(slug);
        });

        const trendsSnap = await getDocs(collection(db, "site_content_journalTrends"));
        trendsSnap.forEach(doc => {
          const d = doc.data();
          const slug = d.title ? d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : doc.id;
          if (slug) postSlugs.push(slug);
        });
      } catch (e) {
        console.error("Error fetching sitemap posts", e);
      }
    }
    if (postSlugs.length === 0) {`;

s = s.replace(regex, replacement);
fs.writeFileSync('server.ts', s);
