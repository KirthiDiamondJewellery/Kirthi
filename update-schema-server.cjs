const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const anchor = 'if (pathPart === "/faq" || pathPart === "/methodology") {';

const replaceWith = `
      // Inject global Organization Schema
      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Kirthi Diamonds",
        "url": "https://kirthidiamonds.com/",
        "logo": "https://kirthidiamonds.com/logo.png",
        "sameAs": [
          "https://www.instagram.com/kirthidiamonds",
          "https://www.facebook.com/kirthidiamonds"
        ]
      };
      newHtml = newHtml.replace('</head>', \`\n<script type="application/ld+json" id="schema-organization">\n\${JSON.stringify(orgSchema, null, 2)}\n</script>\n</head>\`);
      
      const kochiSchema = {
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        "name": "Kirthi Diamonds Kochi",
        "image": "https://kirthidiamonds.com/og-cover.jpg",
        "url": "https://kirthidiamonds.com/kochi",
        "telephone": "+91 484 231 6688",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "3rd Cross Road, Panampilly Nagar",
          "addressLocality": "Kochi",
          "addressRegion": "Kerala",
          "postalCode": "682036",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 9.9654,
          "longitude": 76.2965
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "19:00"
          }
        ]
      };
      
      const calicutSchema = {
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        "name": "Kirthi Diamonds Calicut",
        "image": "https://kirthidiamonds.com/og-cover.jpg",
        "url": "https://kirthidiamonds.com/calicut",
        "telephone": "+91 495 272 5461",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Puthiyara",
          "addressLocality": "Kozhikode",
          "addressRegion": "Kerala",
          "postalCode": "673004",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 11.2588,
          "longitude": 75.7804
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "19:00"
          }
        ]
      };
      
      if (pathPart === "/" || pathPart === "/contact" || pathPart === "/kochi" || pathPart === "/calicut") {
         newHtml = newHtml.replace('</head>', \`\n<script type="application/ld+json" id="schema-kochi-boutique">\n\${JSON.stringify(kochiSchema, null, 2)}\n</script>\n<script type="application/ld+json" id="schema-calicut-boutique">\n\${JSON.stringify(calicutSchema, null, 2)}\n</script>\n</head>\`);
      }

      if (pathPart === "/faq" || pathPart === "/methodology") {
`;

s = s.replace(anchor, replaceWith);
fs.writeFileSync('server.ts', s);
console.log("Updated schema injection in server.ts");
