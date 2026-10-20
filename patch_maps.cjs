const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\(typeof process !== 'undefined' && process\.env\?\.GOOGLE_MAPS_PLATFORM_KEY\)/g, '(process.env.GOOGLE_MAPS_PLATFORM_KEY)');
  content = content.replace(/\(typeof process !== "undefined" && process\.env\?\.GOOGLE_MAPS_PLATFORM_KEY\)/g, '(process.env.GOOGLE_MAPS_PLATFORM_KEY)');
  fs.writeFileSync(file, content);
}

patch('src/components/StoreLocatorView.tsx');
patch('src/components/BoutiqueView.tsx');
