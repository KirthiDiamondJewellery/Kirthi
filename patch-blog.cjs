const fs = require('fs');
let code = fs.readFileSync('src/components/BlogPostView.tsx', 'utf8');

code = code.replace(
  "const postDescription = post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 155).trim() + \"...\" : \"\");",
  "const postDescription = post.metaDescription || post.excerpt || (post.content ? post.content.replace(/\\*\\*/g, '').replace(/<[^>]+>/g, '').substring(0, 155).trim() + \"...\" : \"\");"
);

// Also fix the meta tags section
code = code.replace(
  "const descRaw = (post.excerpt || post.content?.substring(0, 150) || '');",
  "const descRaw = (post.metaDescription || post.excerpt || post.content?.substring(0, 150) || '');"
);

code = code.replace(
  "let descContent = descRaw.replace(/<[^>]+>/g, '').trim();",
  "let descContent = descRaw.replace(/\\*\\*/g, '').replace(/<[^>]+>/g, '').trim();"
);

fs.writeFileSync('src/components/BlogPostView.tsx', code);
