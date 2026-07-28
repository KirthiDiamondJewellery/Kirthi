const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const replacement = `
    let postSlugs: string[] = [];
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
`;

// Replace from `let postSlugs:` to `} catch (e) {`
s = s.replace(/let postSlugs: string\[\] = \[\];\s*if \(db\) \{\s*try \{\s*const postsSnap = await getDocs\(collection\(db, "site_content_blogPosts"\)\);\s*postsSnap.forEach\(doc => \{\s*const d = doc.data\(\);\s*const slug = d\.title \? d\.title\.toLowerCase\(\)\.replace\(\/\[\^a-z0-9\]\+\/g, '-'\)\.replace\(\/\(\^-|-\$\)\+\/g, ''\) : doc.id;\s*if \(slug\) postSlugs.push\(slug\);\s*\}\);\s*\} catch \(e\) \{/, replacement);

fs.writeFileSync('server.ts', s);
