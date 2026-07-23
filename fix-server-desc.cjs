const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  'desc: "Visit our Kochi boutique at Palarivattom for a one-on-one bespoke diamond jewellery consultation. Explore GIA/IGI certified solitaires and bridal masterpieces."',
  'desc: "Visit our Kochi boutique at Palarivattom for a bespoke diamond jewellery consultation. Explore GIA & IGI certified solitaires and bridal masterpieces."'
);

server = server.replace(
  'desc: "Visit our Calicut boutique at Puthiyara for a one-on-one bespoke diamond jewellery consultation. Explore GIA/IGI certified solitaires and bridal masterpieces."',
  'desc: "Visit our Calicut boutique at Puthiyara for a bespoke diamond jewellery consultation. Explore GIA & IGI certified solitaires and bridal masterpieces."'
);

fs.writeFileSync('server.ts', server);
