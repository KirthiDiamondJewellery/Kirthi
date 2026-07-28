const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const lines = s.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"/find-a-store", priority: "0.9"')) {
    lines[i] = '        { path: "/contact", priority: "0.9", changefreq: "monthly" },\n        { path: "/find-a-store", priority: "0.9", changefreq: "monthly" },';
  }
}
fs.writeFileSync('server.ts', lines.join('\n'));
