const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const anchor = 'const fallbackHtml = `<!-- SEO_LINKS_START --><div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">${buildFallback(meta.fallbackBody)}</div><!-- SEO_LINKS_END -->`;';

const replaceWith = `
      let dynamicFallbackBody = meta.fallbackBody;
      
      // Fetch dynamic content if needed
      if (db) {
        try {
          if (pathPart === "/journal") {
            const snap = await getDocs(collection(db, "site_content_blogPosts"));
            const trendsSnap = await getDocs(collection(db, "site_content_journalTrends"));
            const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const trends = trendsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            dynamicFallbackBody += '<h2>Journal Entries</h2><ul>';
            [...posts, ...trends].forEach(post => {
              const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : encodeURIComponent(post.id);
              dynamicFallbackBody += \`<li><a href="https://kirthidiamonds.com/journal/\${slug}">\${post.title}</a></li>\`;
            });
            dynamicFallbackBody += '</ul>';
          } else if (pathPart === "/shop") {
            const snap = await getDocs(collection(db, "site_content_shopProducts"));
            const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dynamicFallbackBody += '<h2>Products</h2><ul>';
            products.forEach(product => {
              dynamicFallbackBody += \`<li><a href="https://kirthidiamonds.com/shop?product=\${encodeURIComponent(product.id)}">\${product.name}</a></li>\`;
            });
            dynamicFallbackBody += '</ul>';
          }
        } catch (e) {
          console.error("Error fetching dynamic SEO content:", e);
        }
      }
      const fallbackHtml = \`<!-- SEO_LINKS_START --><div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">\${buildFallback(dynamicFallbackBody)}</div><!-- SEO_LINKS_END -->\`;
`;

s = s.replace(anchor, replaceWith);
fs.writeFileSync('server.ts', s);
console.log("Updated server.ts successfully");
