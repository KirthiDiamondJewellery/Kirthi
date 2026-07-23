const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `
            if (!post) {
              throw new Error('404_NOT_FOUND');
            }
`;

const replaceStr = `
            if (!post) {
              console.error("404 Not Found for slug: " + slug);
              snapshot.forEach(doc => {
                  const data = doc.data();
                  const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                  console.error("Available post: " + pSlug);
              });
              throw new Error('404_NOT_FOUND');
            }
`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('server.ts', code);
