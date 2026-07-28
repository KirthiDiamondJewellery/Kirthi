const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  `      "/contact"`,
  `      "/contact",
      "/faq",
      "/terms",
      "/pages/policies",
      "/pages/diamond-jewellery",
      "/pages/certified-diamonds",
      "/pages/exchange-policy"`
);

fs.writeFileSync('server.ts', server);
