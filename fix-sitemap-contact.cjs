const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');
serverTs = serverTs.replace('{ path: "/pages/contact", priority: "0.9", changefreq: "monthly" },', '{ path: "/contact", priority: "0.9", changefreq: "monthly" },');
serverTs = serverTs.replace('"/contact": {\n        title: "Contact Us | Kirthi Diamonds",\n        desc: "Reach out to our one-on-one bespoke consultation for bespoke commissions, viewing appointments at our exclusive boutiques, and customer support.",\n        fallbackBody: "<h1>Contact Us</h1><p>Reach out to our one-on-one bespoke consultation for bespoke commissions, viewing appointments at our exclusive boutiques, and customer support.</p>"\n      },', ''); // Wait, I already have /contact in SEO dict!

fs.writeFileSync('server.ts', serverTs);
