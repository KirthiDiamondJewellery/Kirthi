const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const descRaw = (post.excerpt || post.content?.substring(0, 150) || '');",
  "const descRaw = (post.metaDescription || post.excerpt || post.content?.substring(0, 150) || '');"
);

// We should strip markdown syntax from descRaw using a simple regex before stripping html
code = code.replace(
  "let descContent = descRaw.replace(/<[^>]+>/g, '').trim();",
  "let descContent = descRaw.replace(/\\*\\*/g, '').replace(/<[^>]+>/g, '').trim();"
);

fs.writeFileSync('server.ts', code);
