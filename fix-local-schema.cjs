const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const replacement = `
    let jewelryStoreSchema = {
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      "name": "Kirthi Diamonds",
      "image": "https://kirthidiamonds.com/og-cover.jpg",
      "@id": "https://kirthidiamonds.com",
      "url": "https://kirthidiamonds.com",
      "telephone": "[WHATSAPP_NUMBER]",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "34/572, By Pass Road, Palarivattom",
        "addressLocality": "Kochi",
        "postalCode": "682024",
        "addressCountry": "IN"
      }
    };
    
    if (pathPart === '/calicut') {
      jewelryStoreSchema.address = {
        "@type": "PostalAddress",
        "streetAddress": "61/11508A, Opposite Federal Bank, Puthiyara",
        "addressLocality": "Kozhikode",
        "postalCode": "673004",
        "addressCountry": "IN"
      };
      jewelryStoreSchema["@id"] = "https://kirthidiamonds.com/calicut";
      jewelryStoreSchema.url = "https://kirthidiamonds.com/calicut";
    } else if (pathPart === '/kochi') {
      jewelryStoreSchema["@id"] = "https://kirthidiamonds.com/kochi";
      jewelryStoreSchema.url = "https://kirthidiamonds.com/kochi";
    }
`;

// Replace the old constant schema with the dynamic one
file = file.replace(/const jewelryStoreSchema = \{[\s\S]*?"addressCountry": "IN"\n      \}\n    \};/, replacement.trim());

fs.writeFileSync('server.ts', file);
