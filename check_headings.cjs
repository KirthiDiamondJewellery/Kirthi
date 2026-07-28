const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));
files.push('src/App.tsx');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const h1s = (content.match(/<h1[^>]*>/g) || []).length;
  const h2s = (content.match(/<h2[^>]*>/g) || []).length;
  const h3s = (content.match(/<h3[^>]*>/g) || []).length;
  
  if (h1s > 0 || h2s > 0 || h3s > 0) {
    console.log(`${file}: H1=${h1s}, H2=${h2s}, H3=${h3s}`);
  }
}
