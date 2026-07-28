const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  '{ path: "/contact",      "/find-a-store", priority: "0.9", changefreq: "monthly" },',
  '{ path: "/contact", priority: "0.9", changefreq: "monthly" }, { path: "/find-a-store", priority: "0.9", changefreq: "monthly" },'
);

fs.writeFileSync('server.ts', server);
