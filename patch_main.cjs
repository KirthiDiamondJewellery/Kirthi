const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

// Ensure StoreLocatorView is imported
if (!content.includes('import StoreLocatorView')) {
  content = content.replace(
    'import ContactView from \'./components/ContactView\';',
    'import ContactView from \'./components/ContactView\';\nimport StoreLocatorView from \'./components/StoreLocatorView\';'
  );
}

// Ensure the route is added
if (!content.includes('<Route path="/find-a-store"')) {
  content = content.replace(
    '<Route path="/faq" element={<FAQView />} />',
    '<Route path="/faq" element={<FAQView />} />\n            <Route path="/find-a-store" element={<StoreLocatorView />} />'
  );
}

fs.writeFileSync('src/main.tsx', content);
