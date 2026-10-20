const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import BoutiqueLocalView from')) {
  content = content.replace(
    /import StoreLocatorView from "\.\/components\/StoreLocatorView";/,
    'import StoreLocatorView from "./components/StoreLocatorView";\nimport BoutiqueLocalView from "./components/BoutiqueLocalView";'
  );
  fs.writeFileSync('src/App.tsx', content);
}
