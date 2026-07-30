const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

s = s.replace(/dynamicFallbackBody \+= '<h2>Journal Entries<\/h2><ul>';\n\s*\[\.\.\.posts, \.\.\.trends\]\.forEach\(post => \{/g, `if (posts.length > 0 || trends.length > 0) {
              dynamicFallbackBody += '<h2>Journal Entries</h2><ul>';
            }
            [...posts, ...trends].forEach(post => {`);
            
s = s.replace(/\}\);\n\s*dynamicFallbackBody \+= '<\/ul>';\n\s*\} else if \(pathPart === "\/shop"\) \{/g, `});
            if (posts.length > 0 || trends.length > 0) {
              dynamicFallbackBody += '</ul>';
            }
          } else if (pathPart === "/shop") {`);

s = s.replace(/dynamicFallbackBody \+= '<h2>Products<\/h2><ul>';\n\s*products\.forEach\(product => \{/g, `if (products.length > 0) {
              dynamicFallbackBody += '<h2>Products</h2><ul>';
            }
            products.forEach(product => {`);

s = s.replace(/\}\);\n\s*dynamicFallbackBody \+= '<\/ul>';\n\s*\}/g, `});
            if (products.length > 0) {
              dynamicFallbackBody += '</ul>';
            }
          }`);

fs.writeFileSync('server.ts', s);
