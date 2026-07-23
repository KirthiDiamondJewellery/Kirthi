const fs = require('fs');
let file = fs.readFileSync('src/main.tsx', 'utf8');

// Add code to remove seo-links after hydration
if (!file.includes('document.getElementById("seo-links")?.remove()')) {
  file = file.replace(
    'createRoot(document.getElementById(\'root\')!).render(',
    'document.getElementById("seo-links")?.remove();\n\ncreateRoot(document.getElementById(\'root\')!).render('
  );
  fs.writeFileSync('src/main.tsx', file);
}
