const fs = require('fs');

let adminBlogPosts = fs.readFileSync('src/components/AdminBlogPosts.tsx', 'utf8');
adminBlogPosts = adminBlogPosts.replace('const fetchPosts = async () => {', 'async function fetchPosts() {');
fs.writeFileSync('src/components/AdminBlogPosts.tsx', adminBlogPosts, 'utf8');

