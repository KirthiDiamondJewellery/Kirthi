const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /const staticRoutes = \[[^\]]+\];/;
const replacement = `const staticRoutes = [
        { path: "", priority: "1.0", changefreq: "daily" },
        { path: "/shop", priority: "0.9", changefreq: "daily" },
        { path: "/brides", priority: "0.8", changefreq: "weekly" },
        { path: "/heritage", priority: "0.7", changefreq: "monthly" },
        { path: "/methodology", priority: "0.7", changefreq: "monthly" },
        { path: "/journal", priority: "0.8", changefreq: "weekly" },
        { path: "/maison", priority: "0.8", changefreq: "monthly" },
        { path: "/faq", priority: "0.7", changefreq: "weekly" },
        { path: "/kochi", priority: "0.8", changefreq: "monthly" },
        { path: "/calicut", priority: "0.8", changefreq: "monthly" },
        { path: "/terms", priority: "0.5", changefreq: "monthly" },
        { path: "/contact", priority: "0.9", changefreq: "monthly" },
        { path: "/find-a-store", priority: "0.9", changefreq: "monthly" },
        { path: "/pages/policies", priority: "0.8", changefreq: "monthly" }
      ];`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
