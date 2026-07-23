const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const newFAQ = `
              } else if (slug === "artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference") {
                const artisanalFaqSchema = {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is the difference between artisanal and mass-produced diamond jewellery?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Mass-produced jewellery is cast in large volumes using generic alloys and pre-cut stone parcels, which can lead to loose stones and dull light refraction. Artisanal jewellery is bespoke, with each setting hand-sculpted around the unique geometry of specific GIA or IGI certified stones, ensuring absolute clarity of light dispersion and superior comfort."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Are Kirthi Diamonds artisanal or mass-produced?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "At Kirthi Diamonds, every piece is a bespoke dialogue. We refuse the commercialized, high-throughput model. Our master bench jewellers hand-pull platinum wires and individually forge 18kt and 22kt gold mounts to fit the precise physical characteristics of each certified diamond."
                      }
                    }
                  ]
                };
                newHtml = newHtml.replace('</head>', \`\\n<script type="application/ld+json">\\n\${JSON.stringify(schema)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(artisanalFaqSchema)}\\n</script>\\n</head>\`);
`;

file = file.replace(
  /} else {\n                newHtml = newHtml.replace\('<\/head>', `\\n<script type="application\/ld\+json">\\n\$\{JSON\.stringify\(schema\)\}\\n<\/script>\\n<\/head>`\);\n              }/,
  newFAQ + `              } else {\n                newHtml = newHtml.replace('</head>', \`\\n<script type="application/ld+json">\\n\${JSON.stringify(schema)}\\n</script>\\n</head>\`);\n              }`
);

fs.writeFileSync('server.ts', file);
