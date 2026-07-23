const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(pathPart\.startsWith\("\/journal\/"\) && pathPart !== "\/journal"\) \{[\s\S]*?\} else if \(customMeta\[pathPart\]\) \{/;

const replacement = `if (pathPart.startsWith("/journal/") && pathPart !== "/journal") {
      const slug = pathPart.replace("/journal/", "");
      if (slug && slug !== "") {
        try {
          let post: any = null;
          let categoryName = "The Publication";

          if (db) {
            const postsCollection = collection(db, "site_content_blogPosts");
            const trendsCollection = collection(db, "site_content_journalTrends");
            const snapshot = await getDocs(postsCollection);
            const trendsSnapshot = await getDocs(trendsCollection);
            
            snapshot.forEach(doc => {
              const data = doc.data();
              const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
              if (pSlug === slug) {
                post = { id: doc.id, ...data };
              }
            });
            
            if (!post) {
              trendsSnapshot.forEach(doc => {
                const data = doc.data();
                const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                if (pSlug === slug) {
                  post = { id: doc.id, ...data };
                  categoryName = "Trends";
                }
              });
            }
          }

          if (!post) {
            const fallbackPost = hardcodedPosts.find(p => p.id === slug);
            if (fallbackPost) {
              post = fallbackPost;
            }
          }

          if (!post) {
            console.error("404 Not Found for slug: " + slug);
            throw new Error('404_NOT_FOUND');
          }

          if (post) {
            newHtml = newHtml.replace(
              /<title>.*?<\\/title>/gi, 
              \`<title>\${post.title || 'Blog Post'} | Kirthi Diamonds</title>\`
            );
            
            const descRaw = (post.metaDescription || post.excerpt || post.content?.substring(0, 150) || '');
            let descContent = descRaw.replace(/\\*\\*/g, '').replace(/<[^>]+>/g, '').trim();
            if (descContent.length > 155) {
              let trimmed = descContent.substring(0, 153);
              trimmed = trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(" "))) + "...";
              descContent = trimmed;
            }
            const desc = descContent.replace(/"/g, '&quot;');
            const title = post.title || 'Blog Post';
            
            newHtml = replaceMetaTag(newHtml, "name", "description", desc);
            newHtml = replaceMetaTag(newHtml, "property", "og:title", title);
            newHtml = replaceMetaTag(newHtml, "property", "og:description", desc);
            newHtml = replaceMetaTag(newHtml, "name", "twitter:title", title);
            newHtml = replaceMetaTag(newHtml, "name", "twitter:description", desc);
            
            const img = post.featuredImage && post.featuredImage.trim() !== "" 
               ? post.featuredImage 
               : "https://kirthidiamonds.com/og-cover.jpg";
            newHtml = replaceMetaTag(newHtml, "property", "og:image", img);
            newHtml = replaceMetaTag(newHtml, "name", "twitter:image", img);
            newHtml = replaceMetaTag(newHtml, "property", "og:image:width", "1200");
            newHtml = replaceMetaTag(newHtml, "property", "og:image:height", "630");
            
            const schema = {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "image": img,
              "datePublished": post.date || new Date().toISOString(),
              "dateModified": post.date || new Date().toISOString(),
              "author": [{
                "@type": "Organization",
                "name": "Kirthi Diamonds"
              }]
            }; 
            const breadcrumbCategoryName = post.category || categoryName;
            
            const breadcrumbSchema = {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://kirthidiamonds.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Journal",
                  "item": "https://kirthidiamonds.com/journal"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": breadcrumbCategoryName,
                  "item": "https://kirthidiamonds.com/journal"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": post.title,
                  "item": \`https://kirthidiamonds.com/journal/\${slug}\`
                }
              ]
            };
            
            newHtml = newHtml.replace('</head>', \`\\n<script type="application/ld+json">\\n\${JSON.stringify(schema, null, 2)}\\n<\\/script>\\n<script type="application/ld+json">\\n\${JSON.stringify(breadcrumbSchema, null, 2)}\\n<\\/script>\\n</head>\`);
            
            const fallbackContent = \`
              <article>
                <h1>\${post.title}</h1>
                <img src="\${img}" alt="\${post.title}" />
                <div>\${weaveLinks(post.content || '', post.id || slug)}</div>
              </article>
            \`;
            newHtml = newHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, \`<!-- SEO_LINKS_START --><div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">\${buildFallback(fallbackContent)}</div><!-- SEO_LINKS_END -->\`);
          }
        } catch (e: any) {
          if (e.message === '404_NOT_FOUND') throw e;
          console.error("Error SSRing blog post", e);
        }
      }
    } else if (customMeta[pathPart]) {`;

serverTs = serverTs.replace(regex, replacement);
fs.writeFileSync('server.ts', serverTs);
console.log('Replaced block successfully');
