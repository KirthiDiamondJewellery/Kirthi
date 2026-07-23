const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `    // 4. Wix legacy redirects and article removals
    if (pathPart === '/journal/onam-2026-diamond-jewellery-guide-what-to-buy-and-where-in-kerala') {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = '/journal' + queryPart;
      shouldRedirect = true;
    } else if (pathPart.startsWith('/projects')) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = '/heritage' + queryPart;
      shouldRedirect = true;
    } else if (pathPart.startsWith('/product-page')) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = '/shop' + queryPart;
      shouldRedirect = true;
    }`;

const newStr = `    // 4. Wix legacy redirects and article removals
    if (pathPart === '/journal/onam-2026-diamond-jewellery-guide-what-to-buy-and-where-in-kerala') {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = '/journal' + queryPart;
      shouldRedirect = true;
    } else if (pathPart.startsWith('/projects')) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = '/heritage' + queryPart;
      shouldRedirect = true;
    } else if (pathPart.startsWith('/product-page')) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = '/shop' + queryPart;
      shouldRedirect = true;
    }
    
    // Legacy Path Mappings
    let legacyMatch = false;
    let mappedPath = pathPart;
    if (pathPart === '/about') mappedPath = '/heritage';
    else if (pathPart === '/faq') mappedPath = '/methodology';
    else if (pathPart === '/collections') mappedPath = '/shop';
    else if (pathPart.startsWith('/collections/')) {
      mappedPath = '/shop/category/' + pathPart.replace('/collections/', '');
    }
    else if (pathPart === '/all-products') mappedPath = '/shop/category/all';
    else if (pathPart === '/contact-us' || pathPart === '/pages/contact') mappedPath = '/contact';
    else if (pathPart === '/pages/diamond-jewellery') mappedPath = '/shop';
    
    if (mappedPath !== pathPart) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      targetPath = mappedPath + queryPart;
      shouldRedirect = true;
    }`;

code = code.replace(targetStr, newStr);

// I should also remove the duplicate middleware I added.
const redundantStr = `  // Redirects middleware
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
`;

code = code.replace(redundantStr, "");

fs.writeFileSync('server.ts', code);
