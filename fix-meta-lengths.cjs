const fs = require('fs');

// Fix ContentContext
let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

content = content.replace(
  'metaDescription: "An expert guide to GIA and IGI diamond certification for Indian buyers, with practical advice on which to choose for investment-grade solitaires versus bridal jewellery."',
  'metaDescription: "An expert guide to GIA and IGI certification for Indian buyers. Learn which to choose for investment-grade solitaires and bespoke bridal jewellery."'
);

content = content.replace(
  'metaDescription: "Hindu, Christian, and Muslim Kerala wedding diamond jewellery traditions explained - Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam, diamond chokers, jhumkas, and kada bangles."',
  'metaDescription: "Kerala wedding diamond jewellery traditions explained — exploring heritage designs like Mullamottu Mala, Palakka Mala, and Lakshmi Haram for the modern bride."'
);

fs.writeFileSync('src/contexts/ContentContext.tsx', content);

// Fix server.ts
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  'desc: "Find answers to our most frequently asked questions regarding GIA/IGI certification, bespoke commissions, custom jewellery design, and lifetime exchange policies."',
  'desc: "Find answers to frequently asked questions regarding GIA/IGI certification, bespoke diamond commissions, and our lifetime exchange policies."'
);

server = server.replace(
  'title: "Lifetime Diamond Buyback and Exchange Policy | Kirthi Diamonds"',
  'title: "Lifetime Diamond Exchange Policy | Kirthi Diamonds"'
);

server = server.replace(
  'title: "Kirthi Diamonds Kochi Boutique | Bespoke Jewellers Palarivattom"',
  'title: "Kochi Boutique | Kirthi Diamonds"'
);

server = server.replace(
  'title: "Kirthi Diamonds Calicut Boutique | Bespoke Jewellers Puthiyara"',
  'title: "Calicut Boutique | Kirthi Diamonds"'
);

fs.writeFileSync('server.ts', server);

