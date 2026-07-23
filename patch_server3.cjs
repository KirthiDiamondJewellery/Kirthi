const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `
            if (!post) {
              throw new Error('404_NOT_FOUND');
            }
`;

const replaceStr = `
            if (!post) {
              // Try to find the post again with encodeURIComponent just in case
              snapshot.forEach(doc => {
                  const data = doc.data();
                  const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                  if (encodeURIComponent(pSlug) === slug || pSlug === decodeURIComponent(slug)) {
                      post = { id: doc.id, ...data };
                  }
              });
            }
            if (!post) {
              throw new Error('404_NOT_FOUND');
            }
`;

code = code.replace(targetStr, replaceStr);

// Fix the catch block reference error
code = code.replace(/vite\.transformIndexHtml\(req\.originalUrl, template\)/g, "vite.transformIndexHtml(req.originalUrl || '/', template)");

fs.writeFileSync('server.ts', code);
