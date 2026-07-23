const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'import PageView from "./components/PageView";',
  'import PageView from "./components/PageView";\nimport BoutiqueLocalView from "./components/BoutiqueLocalView";'
);

code = code.replace(
  '<Route path="/faq" element={<PageView pageId="faq" />} />',
  '<Route path="/faq" element={<PageView pageId="faq" />} />\n          <Route path="/kochi" element={<BoutiqueLocalView location="kochi" />} />\n          <Route path="/calicut" element={<BoutiqueLocalView location="calicut" />} />'
);

fs.writeFileSync('src/App.tsx', code);
