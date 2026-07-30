const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const anchor = 'if (process.env.NODE_ENV !== "production") {';

const replaceWith = `
  app.get('/sitemap.xml', async (req, res) => {
    let urls = [
      'https://kirthidiamonds.com/',
      'https://kirthidiamonds.com/shop',
      'https://kirthidiamonds.com/journal',
      'https://kirthidiamonds.com/brides',
      'https://kirthidiamonds.com/heritage',
      'https://kirthidiamonds.com/methodology',
      'https://kirthidiamonds.com/maison',
      'https://kirthidiamonds.com/contact',
      'https://kirthidiamonds.com/kochi',
      'https://kirthidiamonds.com/calicut'
    ];
    
    if (db) {
      try {
        const snap = await getDocs(collection(db, "site_content_blogPosts"));
        const trendsSnap = await getDocs(collection(db, "site_content_journalTrends"));
        const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const trends = trendsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        [...posts, ...trends].forEach(post => {
          const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : encodeURIComponent(post.id);
          urls.push(\`https://kirthidiamonds.com/journal/\${slug}\`);
        });
      } catch (e) {
        console.error("Error fetching articles for sitemap", e);
      }
    }
    
    const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\${urls.map(url => \`  <url>\\n    <loc>\${url}</loc>\\n  </url>\`).join('\\n')}
</urlset>\`;
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });
  
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\\nAllow: /\\n\\nSitemap: https://kirthidiamonds.com/sitemap.xml');
  });

  if (process.env.NODE_ENV !== "production") {
`;

s = s.replace(anchor, replaceWith);
fs.writeFileSync('server.ts', s);
console.log("Added sitemap and robots routes");
