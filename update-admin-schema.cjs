const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/schema=\{\{ id: 'string', title: 'string', date: 'string', excerpt: 'string', content: 'string', image: 'image', images: 'imageGallery' \}\}/g, 
  "schema={{ id: 'string', title: 'string', date: 'string', excerpt: 'string', content: 'string', image: 'image', featuredImage: 'image', images: 'imageGallery' }}");

fs.writeFileSync('src/components/AdminView.tsx', code);
