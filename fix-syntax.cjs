const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// Replace the broken part
file = file.replace(
  /      },\n        title: "Diamond Jewellery in Kochi & Calicut \| Kirthi Diamonds",\n        desc: "Boutique luxury diamond jewellers in Kochi and Calicut with GIA and IGI certified diamonds, BIS hallmarked gold, lifetime buyback.",\n        fallbackBody: "<h1>Diamond Jewellery in Kochi & Calicut<\/h1><p>Explore our bespoke luxury diamond jewellery crafted with GIA and IGI certified diamonds and BIS hallmarked gold\.<\/p>"\n      },/g,
  '      },'
);

fs.writeFileSync('server.ts', file);
