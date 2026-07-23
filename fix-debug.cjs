const fs = require('fs');
let serverTs = fs.readFileSync('dist/server.cjs', 'utf8');

serverTs = serverTs.replace(
    /const img = meta\.image \|\| "https:\/\/kirthidiamonds\.com\/og-cover\.jpg";/,
    `const img = meta.image || "https://kirthidiamonds.com/og-cover.jpg";\nconsole.log("DEBUG: img is", img, "for", pathPart);`
);

fs.writeFileSync('dist/server.cjs', serverTs);
