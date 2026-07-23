const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
`;

const newStr = `
  // Redirects middleware
  app.use((req, res, next) => {
    let hostname = req.hostname;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    let urlPath = req.path;
    let shouldRedirect = false;
    let targetHost = hostname;
    
    // Normalize www to apex
    if (hostname.startsWith('www.')) {
      targetHost = hostname.replace('www.', '');
      shouldRedirect = true;
    }
    
    // Normalize trailing slashes
    if (urlPath !== '/' && urlPath.endsWith('/')) {
      urlPath = urlPath.slice(0, -1);
      shouldRedirect = true;
    }
    
    // Path mappings
    let targetPath = urlPath;
    if (urlPath === '/about') targetPath = '/heritage';
    else if (urlPath === '/faq') targetPath = '/methodology';
    else if (urlPath === '/collections') targetPath = '/shop';
    else if (urlPath.startsWith('/collections/')) {
      targetPath = '/shop/category/' + urlPath.replace('/collections/', '');
    }
    else if (urlPath === '/all-products') targetPath = '/shop/category/all';
    else if (urlPath === '/contact-us' || urlPath === '/pages/contact') targetPath = '/contact';
    else if (urlPath === '/pages/diamond-jewellery') targetPath = '/shop';
    
    if (targetPath !== urlPath) {
      shouldRedirect = true;
    }
    
    if (shouldRedirect) {
      const queryString = Object.keys(req.query).length ? '?' + new URLSearchParams(req.query).toString() : '';
      return res.redirect(301, \`\${protocol}://\${targetHost}\${targetPath}\${queryString}\`);
    }
    
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('server.ts', code);
