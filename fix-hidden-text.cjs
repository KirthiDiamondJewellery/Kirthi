const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// Replace the buildFallback replacement for customMeta routes
file = file.replace(
  /newHtml = newHtml\.replace\(\/<!-- SEO_LINKS_START -->\[\\s\\S\]\*\?<!-- SEO_LINKS_END -->\/, `<!-- SEO_LINKS_START --><div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect\(0,0,0,0\); border:0;">\$\{buildFallback\(meta\.fallbackBody\)\}<\/div><!-- SEO_LINKS_END -->`\);/,
  `newHtml = newHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, '');`
);

fs.writeFileSync('server.ts', file);
