const fs = require('fs');
let file = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

file = file.replace(
  '<p>The distinction between mass-produced and artisanal diamond jewellery goes far deeper than price. Mass-produced items are cast in massive volumes using generic alloys and pre-cut stone parcels. These settings often lack precision, leading to loose stones and dull light refraction.</p><p>Artisanal jewellery, by contrast, is a bespoke dialogue. Each setting is sculpted around the unique geometry of the specific GIA or IGI certified stones selected for the design. The metal alloy is custom-refined for optimal color and strength, and every micro-prong is sculpted by hand. The difference is immediately visible in the absolute clarity of light dispersion and the weight and comfort of the piece.</p>',
  '<p>The distinction between mass-produced and artisanal diamond jewellery goes far deeper than price.</p><h3>What is the difference between artisanal and mass-produced diamond jewellery?</h3><p>Mass-produced jewellery is cast in large volumes using generic alloys and pre-cut stone parcels, which can lead to loose stones and dull light refraction. Artisanal jewellery is bespoke, with each setting hand-sculpted around the unique geometry of specific GIA or IGI certified stones, ensuring absolute clarity of light dispersion and superior comfort.</p><h3>Are Kirthi Diamonds artisanal or mass-produced?</h3><p>At Kirthi Diamonds, every piece is a bespoke dialogue. We refuse the commercialized, high-throughput model. Our master bench jewellers hand-pull platinum wires and individually forge 18kt and 22kt gold mounts to fit the precise physical characteristics of each certified diamond.</p>'
);

fs.writeFileSync('src/contexts/ContentContext.tsx', file);
