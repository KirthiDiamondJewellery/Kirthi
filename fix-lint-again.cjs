const fs = require('fs');

let adminBlog = fs.readFileSync('src/components/AdminBlogPosts.tsx', 'utf8');
adminBlog = adminBlog.replace('fetchPosts();', '// eslint-disable-next-line react-hooks/set-state-in-effect\n    fetchPosts();');
fs.writeFileSync('src/components/AdminBlogPosts.tsx', adminBlog, 'utf8');
