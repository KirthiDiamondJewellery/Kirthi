const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');
s = s.replace(
  '{ path: "/contact",      "/find-a-store", priority: "0.9", changefreq: "monthly" },',
  '{ path: "/contact", priority: "0.9", changefreq: "monthly" },\n        { path: "/find-a-store", priority: "0.9", changefreq: "monthly" },'
);
fs.writeFileSync('server.ts', s);
