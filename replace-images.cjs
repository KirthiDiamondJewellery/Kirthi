const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if ((fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) && !fullPath.includes('node_modules')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace all unsplash image links in quotes with empty strings
      content = content.replace(/'https:\/\/images\.unsplash\.com[^']*'/g, '""');
      content = content.replace(/"https:\/\/images\.unsplash\.com[^"]*"/g, '""');
      
      // Also remove vimeo and other raw links if they are placeholders (in LandingView or contentStore)
      content = content.replace(/"https:\/\/player\.vimeo\.com[^"]*"/g, '""');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('done');
