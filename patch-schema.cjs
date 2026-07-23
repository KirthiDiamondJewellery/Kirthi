const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /const organizationSchema = \{[\s\S]*?\};[\s\S]*?const kochiStoreSchema = \{[\s\S]*?\};[\s\S]*?const calicutStoreSchema = \{[\s\S]*?\};/m;
const match = code.match(regex);

if (match) {
  const newSchema = `
    const jewelryStoreSchema = {
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      "name": "Kirthi Diamonds",
      "image": "https://kirthidiamonds.com/og-cover.jpg",
      "@id": "https://kirthidiamonds.com",
      "url": "https://kirthidiamonds.com",
      "telephone": "[WHATSAPP_NUMBER]",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "34/572, By Pass Road, Palarivattom",
        "addressLocality": "Kochi",
        "postalCode": "682024",
        "addressCountry": "IN"
      }
    };
  `;
  code = code.replace(regex, newSchema);

  // also replace the injection string
  const injectRegex = /newHtml = newHtml.replace\('<\/head>', `\\n<script type="application\/ld\+json">\\n\$\{JSON.stringify\(organizationSchema\)\}\\n<\/script>\\n<script type="application\/ld\+json">\\n\$\{JSON.stringify\(kochiStoreSchema\)\}\\n<\/script>\\n<script type="application\/ld\+json">\\n\$\{JSON.stringify\(calicutStoreSchema\)\}\\n<\/script>\\n<\/head>`\);/;
  const injectNew = "newHtml = newHtml.replace('</head>', `\\n<script type=\"application/ld+json\">\\n${JSON.stringify(jewelryStoreSchema, null, 2)}\\n</script>\\n</head>`);";
  
  code = code.replace(injectRegex, injectNew);
  fs.writeFileSync('server.ts', code);
  console.log("Patched successfully.");
} else {
  console.log("Could not find the schemas to replace.");
}
