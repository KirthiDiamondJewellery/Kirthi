const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/if \(posts\.length > 0 \|\| trends\.length > 0\) \{/g, `
            if (posts.length === 0 && trends.length === 0) {
               posts = hardcodedPosts;
            }
            if (posts.length > 0 || trends.length > 0) {`);

fs.writeFileSync('server.ts', s);
