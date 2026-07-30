const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/let dynamicFallbackBody = meta\.fallbackBody;\n\s*\/\/ Fetch dynamic content if needed\n\s*if \(db\) \{[\s\S]*?\} catch \(e\) \{[\s\S]*?\}\n\s*\}/, 
`let dynamicFallbackBody = meta.fallbackBody;
      let posts = [];
      let trends = [];
      let products = [];
      if (db) {
        try {
          if (pathPart === "/journal") {
            const snap = await db.collection("site_content_blogPosts").get();
            const trendsSnap = await db.collection("site_content_journalTrends").get();
            posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            trends = trendsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          } else if (pathPart === "/shop") {
            const snap = await db.collection("site_content_shopProducts").get();
            products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (e) {
          console.error("Error fetching dynamic SEO content:", e);
        }
      }
      
      if (pathPart === "/journal") {
        if (posts.length === 0 && trends.length === 0) {
           posts = hardcodedPosts;
        }
        if (posts.length > 0 || trends.length > 0) {
          dynamicFallbackBody += '<h2>Journal Entries</h2><ul>';
        }
        [...posts, ...trends].forEach(post => {
          const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : encodeURIComponent(post.id);
          dynamicFallbackBody += \`<li><a href="https://kirthidiamonds.com/journal/\${slug}">\${post.title}</a></li>\`;
        });
        if (posts.length > 0 || trends.length > 0) {
          dynamicFallbackBody += '</ul>';
        }
      } else if (pathPart === "/shop") {
        if (products.length === 0) {
          products = PRODUCTS;
        }
        if (products.length > 0) {
          dynamicFallbackBody += '<h2>Products</h2><ul>';
        }
        products.forEach(product => {
          dynamicFallbackBody += \`<li><a href="https://kirthidiamonds.com/shop?product=\${encodeURIComponent(product.id)}">\${product.name}</a></li>\`;
        });
        if (products.length > 0) {
          dynamicFallbackBody += '</ul>';
        }
      }`);

fs.writeFileSync('server.ts', s);
