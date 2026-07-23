const fs = require('fs');

// Fix main.tsx
let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');
mainTsx = mainTsx.replace('<Route path="/pages/contact" element={<ContactView />} />', '<Route path="/contact" element={<ContactView />} />');
fs.writeFileSync('src/main.tsx', mainTsx);

// Fix server.ts
let serverTs = fs.readFileSync('server.ts', 'utf8');
// Remove `|| pathPart === '/pages/contact'` from middleware
serverTs = serverTs.replace("else if (pathPart === '/contact-us' || pathPart === '/pages/contact') mappedPath = '/contact';", "else if (pathPart === '/contact-us' || pathPart === '/pages/contact') mappedPath = '/contact';");

// Wait, if it maps to `/contact`, we should keep that.
// But we need to make sure `app.get('/contact')` doesn't redirect to `/pages/contact`.
serverTs = serverTs.replace("app.get('/contact', (req, res) => res.redirect(301, '/pages/contact'));", "");
serverTs = serverTs.replace("app.get('/shop/contact-us', (req, res) => res.redirect(301, '/pages/contact'));", "app.get('/shop/contact-us', (req, res) => res.redirect(301, '/contact'));");

// And we need to add "/contact" to validRoutes
serverTs = serverTs.replace('"/faq", "/kochi", "/calicut"', '"/faq", "/kochi", "/calicut", "/contact"');

// And remove the WIX redirect if it redirects contact to pages/contact
serverTs = serverTs.replace("'/contact': '/pages/contact',", "");

fs.writeFileSync('server.ts', serverTs);
