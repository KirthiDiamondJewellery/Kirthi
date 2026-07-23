const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  /Kirthi Diamonds: A bespoke diamond house est\. 2006, rooted in a family diamond trade since 1975\. Discover premium, BIS Hallmarked, GIA & IGI certified diamond and gold jewellery in Kochi and Calicut\./g,
  'Kirthi Diamonds: A bespoke diamond house est. 2006. Discover premium, GIA & IGI certified diamond and BIS Hallmarked gold jewellery in Kochi and Calicut.'
);

fs.writeFileSync('index.html', indexHtml);
