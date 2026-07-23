const fs = require('fs');

const files = [
  'src/components/ShopExperience.tsx',
  'src/components/BlogPostView.tsx',
  'src/components/PageView.tsx',
  'src/components/FAQView.tsx',
  'src/components/BoutiqueLocalView.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove document.title = ...
  content = content.replace(/document\.title\s*=[^;]+;/g, '');
  
  // Remove meta desc updates
  content = content.replace(/const metaDescription = document\.querySelector\('meta\[name="description"\]'\);/g, '');
  content = content.replace(/if \(metaDescription\) metaDescription\.setAttribute\('content', [^;]+;/g, '');
  
  fs.writeFileSync(file, content);
});
console.log("Stripped explicit document.title assignments.");
