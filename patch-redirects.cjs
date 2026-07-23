const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const middleware = `
  // www normalization
  app.use((req, res, next) => {
    if (req.headers.host && req.headers.host.startsWith('www.')) {
      const newHost = req.headers.host.replace(/^www\./, '');
      return res.redirect(301, 'https://' + newHost + req.originalUrl);
    }
    next();
  });
`;

code = code.replace("const app = express();\n  const PORT = 3000;", "const app = express();\n  const PORT = 3000;\n" + middleware);

const newRedirects = `
  app.get('/about', (req, res) => res.redirect(301, '/heritage'));
  app.get('/faq', (req, res) => res.redirect(301, '/methodology'));
  app.get('/collections', (req, res) => res.redirect(301, '/shop'));
  app.get('/collections/*', (req, res) => res.redirect(301, '/shop'));
  app.get('/category/all-products', (req, res) => res.redirect(301, '/shop'));
  // Note: /category/* is already mapped to /shop
  app.get('/shop/contact-us', (req, res) => res.redirect(301, '/pages/contact'));
  app.get('/contact', (req, res) => res.redirect(301, '/pages/contact'));
`;

code = code.replace("// Wildcard redirects for old Wix prefixes", newRedirects + "\n  // Wildcard redirects for old Wix prefixes");

fs.writeFileSync('server.ts', code);
