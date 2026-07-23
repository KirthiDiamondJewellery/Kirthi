const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `      "/pages/diamond-jewellery": {
        title: "Diamond Jewellery in Kochi & Calicut",
        desc: "Explore our bespoke luxury diamond jewellery crafted with GIA and IGI certified diamonds and BIS hallmarked gold.",
        fallbackBody: "<h1>Diamond Jewellery in Kochi & Calicut</h1><p>Explore our bespoke luxury diamond jewellery crafted with GIA and IGI certified diamonds and BIS hallmarked gold.</p>"
      }`;

const replaceStr = targetStr + `,
      "/kochi": {
        title: "Diamond Jewellery Boutique in Kochi | Kirthi Diamonds",
        desc: "Visit Kirthi Diamonds Kochi boutique. Experience our one-on-one consultation model, BIS hallmarked gold, and GIA/IGI certified bespoke bridal jewellery.",
        fallbackBody: "<h1>Kirthi Diamonds, Kochi</h1><p>Our Palarivattom boutique represents the heart of Kirthi Diamonds' design philosophy. Situated in a premier district, this showroom offers our most extensive collection of GIA and IGI certified loose diamonds, alongside an exclusive bridal suite for one-on-one consultation.</p><p>We operate on an uncompromising standard of 100% BIS hallmarked gold (18kt and 22kt), crafting heirloom-quality bespoke jewellery. We reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship.</p><p>The Kochi atelier houses our master craftsmen, allowing clients commissioning bespoke heirlooms to witness the precision of diamond setting and gold forging firsthand.</p>"
      },
      "/calicut": {
        title: "Diamond Jewellery Boutique in Calicut | Kirthi Diamonds",
        desc: "Visit Kirthi Diamonds Calicut boutique. Experience our one-on-one consultation model, BIS hallmarked gold, and GIA/IGI certified bespoke bridal jewellery.",
        fallbackBody: "<h1>Kirthi Diamonds, Calicut</h1><p>Our Puthiyara boutique represents the heart of Kirthi Diamonds' design philosophy. Situated in a premier district, this showroom offers our most extensive collection of GIA and IGI certified loose diamonds, alongside an exclusive bridal suite for one-on-one consultation.</p><p>We operate on an uncompromising standard of 100% BIS hallmarked gold (18kt and 22kt), crafting heirloom-quality bespoke jewellery. We reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship.</p><p>The Calicut atelier houses our master craftsmen, allowing clients commissioning bespoke heirlooms to witness the precision of diamond setting and gold forging firsthand.</p>"
      }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('server.ts', code);
