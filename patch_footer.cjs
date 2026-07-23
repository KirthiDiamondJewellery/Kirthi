const fs = require('fs');
let code = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');

// Replace /pages/diamond-jewellery with /shop
code = code.replace(
  'href="/pages/diamond-jewellery" className="hover:text-white transition-colors">Diamond Jewellery Guide</a>',
  'href="/shop" className="hover:text-white transition-colors">Diamond Jewellery</a>'
);

// Add Contact link
code = code.replace(
  '<li><a href="/pages/policies" className="hover:text-white transition-colors">Policies</a></li>',
  '<li><a href="/pages/policies" className="hover:text-white transition-colors">Policies & Ethics</a></li>\n              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>'
);

// Rename Showroom to Boutique
code = code.replace(
  '<a href="/kochi" className="block text-white/80 hover:text-[#D4AF37] transition-colors mb-2">Kochi Showroom</a>',
  '<a href="/kochi" className="block text-white/80 hover:text-[#D4AF37] transition-colors mb-2">Kochi Boutique</a>'
);
code = code.replace(
  '<a href="/calicut" className="block text-white/80 hover:text-[#D4AF37] transition-colors mb-2">Calicut Showroom</a>',
  '<a href="/calicut" className="block text-white/80 hover:text-[#D4AF37] transition-colors mb-2">Calicut Boutique</a>'
);

// Add JSON-LD block
const jsonLdBlock = `
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "JewelryStore",
            "@id": "https://kirthidiamonds.com/#kochi",
            "name": "Kirthi Diamonds — Kochi",
            "image": "https://kirthidiamonds.com/og-cover.jpg",
            "url": "https://kirthidiamonds.com/",
            "telephone": "[KOCHI_PHONE]",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "34/572, By Pass Road, Palarivattom",
              "addressLocality": "Kochi",
              "addressRegion": "Kerala",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": [{
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
              "opens": "10:00", "closes": "19:30"
            }],
            "priceRange": "$$$",
            "parentOrganization": { "@id": "https://kirthidiamonds.com/#org" }
            // TODO: add geo coordinates for Kochi
          },
          {
            "@type": "Organization",
            "@id": "https://kirthidiamonds.com/#org",
            "name": "Kirthi Diamonds",
            "url": "https://kirthidiamonds.com/",
            "logo": "https://kirthidiamonds.com/logo.png",
            "foundingDate": "2006",
            "description": "A bespoke diamond house established 2006, rooted in a family diamond trade since 1975. GIA and IGI certified diamonds, BIS Hallmarked gold, boutiques in Kochi and Calicut."
          }
        ]
      }) }} />`;

code = code.replace(
  '<footer className="relative w-full bg-black border-t border-white/5 py-24 px-8 md:px-32 flex justify-center mt-20 shrink-0 snap-end">',
  '<footer className="relative w-full bg-black border-t border-white/5 py-24 px-8 md:px-32 flex justify-center mt-20 shrink-0 snap-end">' + jsonLdBlock
);

fs.writeFileSync('src/components/SharedFooter.tsx', code);
