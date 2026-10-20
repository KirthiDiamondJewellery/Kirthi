const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
content = content.replace("{ id: 'access', label: 'Access Control' }", "{ id: 'access', label: 'Access Control' },\n    { id: 'videos', label: 'Video Managers' }");
fs.writeFileSync('src/components/AdminView.tsx', content);
