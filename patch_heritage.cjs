const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

const newDesc = "The story of Kirthi Diamonds is woven deeply into the fabric of time. Established as a bespoke diamond house in 2006, our roots trace back to a family diamond trade that began in 1975. In that year, our grandfather set up a diamond cutting factory in Irinjalakuda, Kerala—the first of its kind in South India for cutting diamonds. Our masterfully cut stones reached clients globally, from Japan to the United States. This rich heritage forms the foundation of every masterpiece we create. We are custodians of a legacy that values uncompromising quality and enduring elegance. From our exclusive boutiques in Kochi and Calicut, we serve discerning patrons who appreciate the subtle luxury of authentic craftsmanship. Our journey is defined by a steadfast commitment to transparency, demonstrated by our strict adherence to independent GIA and IGI certification for all significant diamonds, and BIS Hallmarking for our gold settings. Because we operate on a bespoke, low-volume model, we preserve the intimacy of the traditional jeweller-patron relationship. Each piece in our archive represents a milestone—both for the client who commissioned it and for the artisan who forged it. We invite you to explore this heritage of brilliance.";

content = content.replace(/The story of Kirthi Diamonds is woven deeply into the fabric of time.*?heritage of brilliance\.\s*\[Note to Brand Team[^\]]+\]\./, newDesc);

const old1975 = "Our family\\'s diamond trade begins, establishing deep relationships in Antwerp and Surat for loose diamond sourcing and distribution, setting the standard for uncompromising quality.";
const new1975 = "Our grandfather established the first diamond cutting factory of its kind in South India, located in Irinjalakuda, Kerala. Our masterfully cut diamonds were sought after globally, with clients spanning from Japan to the United States.";

content = content.replace(old1975, new1975);

fs.writeFileSync('src/constants.ts', content);

// Also need to patch ContentContext.tsx for archiveDescription
let ctxContent = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');
ctxContent = ctxContent.replace(/The story of Kirthi Diamonds is woven deeply into the fabric of time.*?heritage of brilliance\.\s*\[Note to Brand Team[^\]]+\]\./, newDesc);
fs.writeFileSync('src/contexts/ContentContext.tsx', ctxContent);

