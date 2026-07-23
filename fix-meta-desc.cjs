const fs = require('fs');
let file = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

// The file has blogPosts array. Let's add metaDescription to each.
// I will use regex replace to add metaDescription: ... right after excerpt: "..."

file = file.replace(/excerpt:\s*"([^"]+)",/g, 'excerpt: "$1",\n      metaDescription: "$1",');

fs.writeFileSync('src/contexts/ContentContext.tsx', file);
