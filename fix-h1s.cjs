const fs = require('fs');

function replaceFirstH2WithH1(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // check if it already has an h1
  if (/<h1[^>]*>/.test(content)) return;

  let replaced = false;
  content = content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/, (match, p1, p2) => {
    replaced = true;
    return `<h1${p1}>${p2}</h1>`;
  });
  
  if (replaced) {
    fs.writeFileSync(filePath, content);
  }
}

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => require('path').join(dir, f));

for (const file of files) {
  // skip modals, calculators and App components if you want
  if (file.includes('Modal') || file.includes('Calculator') || file.includes('OrderStatus')) continue;
  replaceFirstH2WithH1(file);
}
replaceFirstH2WithH1('src/App.tsx');
