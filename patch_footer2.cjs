const fs = require('fs');
let code = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');

const targetStr = `"parentOrganization": { "@id": "https://kirthidiamonds.com/#org" }
            // TODO: add geo coordinates for Kochi
          },
          {
            "@type": "Organization",`;

const replaceStr = `"parentOrganization": { "@id": "https://kirthidiamonds.com/#org" }
          },
          {
            "@type": "JewelryStore",
            "@id": "https://kirthidiamonds.com/#calicut",
            "name": "Kirthi Diamonds — Calicut",
            "image": "https://kirthidiamonds.com/og-cover.jpg",
            "url": "https://kirthidiamonds.com/",
            "telephone": "[CALICUT_PHONE]",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "61/11508A, Opposite Federal Bank, Puthiyara",
              "addressLocality": "Calicut",
              "addressRegion": "Kerala",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": [{
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
              "opens": "09:30", "closes": "19:30"
            }],
            "priceRange": "$$$",
            "parentOrganization": { "@id": "https://kirthidiamonds.com/#org" }
          },
          {
            "@type": "Organization",`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/SharedFooter.tsx', code);
