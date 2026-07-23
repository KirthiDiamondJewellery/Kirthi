const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const articleBlockRegex = /targetTitle = \`\\\$\\{post\?\.title \|\| dynamicSchema\?\.headline\\} \| Kirthi Diamonds\`;/;

// Use post.seoTitle || post.title
const newTitleLogic = "targetTitle = post?.seoTitle || `\\${post?.title || dynamicSchema?.headline} | Kirthi Diamonds`;";

appContent = appContent.replace(articleBlockRegex, newTitleLogic);

fs.writeFileSync('src/App.tsx', appContent);
