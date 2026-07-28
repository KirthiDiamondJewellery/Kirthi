const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  `const validRoutes = ["/", "/journal", "/heritage", "/methodology", "/maison", "/shop", "/brides", "/faq", "/kochi", "/calicut", "/contact"];`,
  `const validRoutes = ["/", "/journal", "/heritage", "/methodology", "/maison", "/shop", "/brides", "/faq", "/kochi", "/calicut", "/contact", "/terms", "/find-a-store"];`
);

fs.writeFileSync('server.ts', server);
