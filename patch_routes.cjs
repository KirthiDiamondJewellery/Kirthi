const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<Route path="/pages/contact" element={<ContactView />} />',
  '<Route path="/contact" element={<ContactView />} />'
);

// I should also ensure /kochi and /calicut routes are added
const targetRoutes = '<Route path="*" element={<LegacyRouteHandler />} />';
const newRoutes = `
          <Route path="/contact" element={<ContactView />} />
          <Route path="/kochi" element={<BoutiqueLocalView location="kochi" />} />
          <Route path="/calicut" element={<BoutiqueLocalView location="calicut" />} />
          <Route path="*" element={<LegacyRouteHandler />} />`;

code = code.replace(targetRoutes, newRoutes);

// Wait, the first replace might have been successful or not, let's just make sure
if (!code.includes('<Route path="/contact" element={<ContactView />} />')) {
   code = code.replace('<Route path="/pages/contact" element={<ContactView />} />', '');
}

fs.writeFileSync('src/App.tsx', code);
