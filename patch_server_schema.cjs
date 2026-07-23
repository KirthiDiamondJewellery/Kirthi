const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetSchema = `              const schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": post.title,
                "description": desc,
                "image": post.image ? [post.image] : [],
                "datePublished": post.date,
                "author": [{
                    "@type": "Person",
                    "name": "Shekar Menon",
                    "url": "https://kirthidiamonds.com"
                }],
                "publisher": {
                    "@type": "Organization",
                    "name": "Kirthi Diamonds",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://kirthidiamonds.com/logo.png"
                    }
                }
              };`;

const newSchema = `              const schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "mainEntityOfPage": "https://kirthidiamonds.com" + pathPart,
                "headline": post.title,
                "description": desc,
                "image": img ? [img] : ["https://kirthidiamonds.com/og-cover.jpg"],
                "datePublished": post.date,
                "dateModified": post.date,
                "author": {
                    "@type": "Organization",
                    "name": "Kirthi Diamonds"
                },
                "publisher": {
                    "@id": "https://kirthidiamonds.com/#org"
                }
              };`;

code = code.replace(targetSchema, newSchema);

// I will also need to add FAQSchema for Artisanal article in server.ts
// But the Artisanal article's FAQ schema is required.
// "FAQPage schema on the Artisanal article only, built from its existing five FAQ Q&A pairs verbatim (with the Task 4 copy corrections applied). Do not add FAQPage to pages without visible FAQ content."
// I can just append it inside the server.ts when path matches.

const artisanFaqLogic = `
              let finalSchemaHtml = \`<script type="application/ld+json">\${JSON.stringify(schema)}</script>\`;
              if (post.title === "Artisanal Diamond Jewellery vs Mass-Produced: What Is the Real Difference?") {
                  const faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                      {
                        "@type": "Question",
                        "name": "What exactly does 'artisanal diamond jewellery' mean?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Artisanal diamond jewellery refers to pieces that are individually crafted by master bench jewellers, rather than mass-produced in a factory. It involves hand-forging the gold or platinum mounts, meticulously setting each stone under a microscope, and finishing the piece by hand to ensure a flawless, tailored fit for the specific diamonds chosen."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Is artisanal jewellery more expensive than mass-produced brands?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Not necessarily. While the labour and time invested are significantly higher, artisanal houses like Kirthi Diamonds often operate on a direct-to-consumer model, avoiding the heavy retail markups and marketing overheads typical of mass-market luxury brands. This means your investment goes directly into the quality of the diamond and the craftsmanship."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "How can I tell if a piece of jewellery is mass-produced?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Mass-produced jewellery often feels lighter, uses less gold (to save costs), and may have generic, pre-cast settings that don't perfectly secure the specific centre stone. Look for 'batch' certification rather than individual stone certificates, and check for signs of porosity (tiny holes) in the metal, which can occur in high-volume casting."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Do artisanal jewellers provide certification?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Yes, reputable artisanal houses provide independent, internationally recognized certification (like GIA or IGI) for every significant diamond they sell, ensuring transparency regarding the 4Cs (Cut, Colour, Clarity, and Carat weight)."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Can I commission a bespoke piece based on my own design?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Yes. One of the primary benefits of an artisanal house is the ability to collaborate directly with the designers and craftsmen. At Kirthi Diamonds, bespoke commissions are taken in person or by consultation appointment, allowing you to create a unique piece tailored to your exact specifications."
                        }
                      }
                    ]
                  };
                  finalSchemaHtml += \`\\n<script type="application/ld+json">\${JSON.stringify(faqSchema)}</script>\`;
              }
              newHtml = newHtml.replace("</head>", \`\${finalSchemaHtml}</head>\`);
`;

code = code.replace(
  'newHtml = newHtml.replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);',
  artisanFaqLogic
);

fs.writeFileSync('server.ts', code);
