const fs = require('fs');
let code = fs.readFileSync('src/components/BlogPostView.tsx', 'utf8');

code = `import { hardcodedPosts } from '../utils/fallbackPosts';\n` + code;

code = code.replace(/if \(!foundPost\) \{[\s\S]*?const trendsSnapshot = await getDocs[\s\S]*?\}\);[\s\S]*?\}/g, (match) => {
  return match + `
          if (!foundPost) {
            const fallback = hardcodedPosts.find(p => p.id === postId);
            if (fallback) foundPost = fallback;
          }`;
});

fs.writeFileSync('src/components/BlogPostView.tsx', code);
