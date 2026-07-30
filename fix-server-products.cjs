const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

if (!s.includes('import { PRODUCTS }')) {
  s = s.replace('import { hardcodedPosts } from "./src/utils/fallbackPosts";', 'import { hardcodedPosts } from "./src/utils/fallbackPosts";\nimport { PRODUCTS } from "./src/constants";');
}

s = s.replace(/if \(products\.length > 0\) \{\n\s*dynamicFallbackBody \+= '<h2>Products<\/h2><ul>';\n\s*\}/g, `
            if (products.length === 0) {
              products = PRODUCTS;
            }
            if (products.length > 0) {
              dynamicFallbackBody += '<h2>Products</h2><ul>';
            }
`);

fs.writeFileSync('server.ts', s);
