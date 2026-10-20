const fs = require('fs');
let content = fs.readFileSync('src/components/BlogPostView.tsx', 'utf8');

content = content.replace(/10am–7:30pm/g, "10:00–19:00");
content = content.replace(/10:00am–7:30pm/g, "09:30–19:30");

fs.writeFileSync('src/components/BlogPostView.tsx', content);
