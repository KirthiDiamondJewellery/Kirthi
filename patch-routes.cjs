const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const imports = `
import BoutiqueLocalView from './components/BoutiqueLocalView';
import ContactView from './components/ContactView';
`;
code = code.replace("import PageView from './components/PageView';", "import PageView from './components/PageView';" + imports);

const routes = `
            <Route path="/pages/contact" element={<ContactView />} />
            <Route path="/kochi" element={<BoutiqueLocalView location="kochi" />} />
            <Route path="/calicut" element={<BoutiqueLocalView location="calicut" />} />
`;
code = code.replace('<Route path="/pages/:slug" element={<PageView />} />', routes + '\n            <Route path="/pages/:slug" element={<PageView />} />');

fs.writeFileSync('src/main.tsx', code);
