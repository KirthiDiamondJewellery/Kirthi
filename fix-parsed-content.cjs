const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/const parsedContent = await marked\.parse\(weaveLinks\(post\.content \|\| '', post\.id \|\| slug\)\);\n/g, '');

s = s.replace(/const faqSchemaForArticle = generateFAQSchema\(parsedContent\);/g, 
  `const parsedContent = await marked.parse(weaveLinks(post.content || '', post.id || slug));
            const faqSchemaForArticle = generateFAQSchema(parsedContent);`);

fs.writeFileSync('server.ts', s);
