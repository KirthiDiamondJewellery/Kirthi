const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix default desc to be < 155
appContent = appContent.replace(
  'let descContent = "A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. VVS1 clarity, E/F colour, 18kt gold. Visit our Kochi & Calicut showrooms or order online.";',
  'let descContent = "A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. Discover GIA & IGI certified diamonds in Kochi and Calicut.";' // 142 chars
);

// 2. Fix targetTitle and descContent in article block
const articleBlockRegex = /if \(post \|\| dynamicSchema\) \{\n          articleTime = post\?\.date \|\| dynamicSchema\?\.datePublished;\n          articleAuthor = 'Kirthi Diamonds';\n        \}/;

const replacement = `if (post || dynamicSchema) {
          articleTime = post?.date || dynamicSchema?.datePublished;
          articleAuthor = 'Kirthi Diamonds';
          targetTitle = \`\${post?.title || dynamicSchema?.headline} | Kirthi Diamonds\`;
          descContent = post?.metaDescription || post?.excerpt || dynamicSchema?.description || descContent;
        }`;

appContent = appContent.replace(articleBlockRegex, replacement);

fs.writeFileSync('src/App.tsx', appContent);
