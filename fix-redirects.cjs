const fs = require('fs');

let serverTs = fs.readFileSync('server.ts', 'utf8');

const regex = /\/\/ SEO Redirect middleware[\s\S]*?next\(\);\n  \}\);/;

const replacement = `// SEO Redirect middleware: HTTPS, www to non-www, and single-hop legacy 301s
  app.use((req, res, next) => {
    let shouldRedirect = false;
    let targetHost = req.headers.host || req.hostname || '';
    let targetPath = req.originalUrl;
    let proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    
    // 1. Force HTTPS in production
    if (proto === 'http' && !targetHost.includes('localhost') && !targetHost.includes('127.0.0.1') && !targetHost.includes('.run.app')) {
      proto = 'https';
      shouldRedirect = true;
    }

    // 2. Redirect www to non-www explicitly
    if (targetHost.startsWith('www.')) {
      targetHost = targetHost.replace(/^www\\./i, '');
      shouldRedirect = true;
    } else if (req.hostname === 'www.kirthidiamonds.com') {
      targetHost = 'kirthidiamonds.com';
      shouldRedirect = true;
    }

    // 3. Trailing slash removal
    let pathPart = targetPath.split('?')[0];
    if (pathPart.length > 1 && pathPart.endsWith('/')) {
      pathPart = pathPart.slice(0, -1);
      shouldRedirect = true;
    }
    
    // 4. Single-hop legacy 301 mapping
    let mappedPath = pathPart;
    if (pathPart === '/about' || pathPart === '/projects') mappedPath = '/heritage';
    else if (pathPart === '/faq') mappedPath = '/methodology';
    else if (pathPart === '/collections' || pathPart.startsWith('/collections/') || pathPart === '/category/all-products' || pathPart.startsWith('/category/') || pathPart.startsWith('/product-page') || pathPart === '/pages/diamond-jewellery') mappedPath = '/shop';
    else if (pathPart.startsWith('/post/') || pathPart === '/journal/onam-2026-diamond-jewellery-guide-what-to-buy-and-where-in-kerala' || pathPart === '/shop/post') mappedPath = '/journal';
    else if (pathPart === '/contact-us' || pathPart === '/pages/contact' || pathPart === '/shop/contact-us') mappedPath = '/contact';
    
    if (mappedPath !== pathPart) {
      shouldRedirect = true;
      pathPart = mappedPath;
    }
    
    if (shouldRedirect) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      return res.redirect(301, \`\${proto}://\${targetHost}\${pathPart}\${queryPart}\`);
    }

    next();
  });`;

serverTs = serverTs.replace(regex, replacement);
fs.writeFileSync('server.ts', serverTs);
console.log('Fixed redirects successfully');
