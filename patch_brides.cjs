const fs = require('fs');
let content = fs.readFileSync('src/components/BridesShowcase.tsx', 'utf8');

const newParagraph = `
Create your custom bridal jewellery Kerala through a one-on-one Kirthi consultation, where every piece is crafted to reflect your unique love story. From an elegant bespoke bridal necklace Kochi to a complete diamond trousseau, our artisans meticulously handcraft each design using only the finest GIA certified bridal diamonds. When you choose Kirthi Diamonds for your wedding diamond jewellery India, you are investing in generational quality. We ensure that every diamond is set in premium BIS hallmarked gold, guaranteeing structural integrity and maximum light transmission. Unlike mass-produced collections, our bridal diamond jewellery Kochi is forged through a slow, deliberate artisanal process that honors traditional techniques while embracing contemporary brilliance. We stand behind our craftsmanship with absolute transparency—providing a written lifetime buyback and exchange promise documented at the time of purchase. Whether you are seeking a minimalist solitaire pendant, an elaborate diamond choker, or a complete heirloom bridal suite, our master bench jewellers are dedicated to creating a masterpiece that will be cherished not just on your wedding day, but by the generations that inherit it. Experience the pinnacle of bespoke luxury and ethical sourcing by scheduling a private consultation at our exclusive boutiques.
`;

content = content.replace(
  'Create your bridal jewellery through a private Kirthi consultation, with certified natural diamonds, BIS hallmarked gold, and a written lifetime buyback and exchange promise documented at purchase.',
  newParagraph.trim()
);

fs.writeFileSync('src/components/BridesShowcase.tsx', content);
