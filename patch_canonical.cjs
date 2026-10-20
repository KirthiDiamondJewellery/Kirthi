const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const injectionScript = `
      } catch (err) {
        console.error("Error fetching SSR data:", err);
      }
      
      // Fix Canonical URL
      let canonicalPath = req.path;
      if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
        canonicalPath = canonicalPath.slice(0, -1);
      }
      const canonicalUrl = 'https://kirthidiamonds.com' + (canonicalPath === '/' ? '' : canonicalPath);
      indexHtml = indexHtml.replace(
        /<link\\s+rel="canonical"\\s+href="https:\\/\\/kirthidiamonds\\.com\\/?"\\s*\\/?>/,
        \`<link rel="canonical" href="\${canonicalUrl}" />\`
      );
      
      // Inject specific content for /methodology and /pages/exchange-policy to replace the generic seo-links
`;

content = content.replace(/} catch \(err\) {[\s\S]*?\/\/ Inject specific content for \/methodology and \/pages\/exchange-policy/, injectionScript);
fs.writeFileSync('server.ts', content);
