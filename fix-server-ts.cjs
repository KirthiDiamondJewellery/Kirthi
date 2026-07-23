const fs = require('fs');

let serverTs = fs.readFileSync('server.ts', 'utf8');

if (!serverTs.includes('import { hardcodedPosts }')) {
    serverTs = serverTs.replace(
        'import { generateFAQSchema } from "./src/utils/seo";',
        'import { generateFAQSchema } from "./src/utils/seo";\nimport { hardcodedPosts } from "./src/utils/fallbackPosts";'
    );
}

serverTs = serverTs.replace(
    'if (!post) {',
    `if (!post) {
              const fallbackPost = hardcodedPosts.find(p => p.id === slug);
              if (fallbackPost) {
                post = fallbackPost;
              }
            }
            if (!post) {`
);

serverTs = serverTs.replace(
    /if \(db\) \{\s*try \{\s*const postsCollection = collection\(db, "site_content_blogPosts"\);/,
    `try {
            let post: any = null;
            let categoryName = "The Publication";

            if (db) {
                const postsCollection = collection(db, "site_content_blogPosts");`
);

fs.writeFileSync('server.ts', serverTs);
console.log('Fixed server.ts');
