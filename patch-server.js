const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

const heritageHtml = `
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>The Heritage of Kirthi Diamonds</h1>
            <p>Kirthi Diamonds is a bespoke diamond jeweller in Kochi since 2006, born from a family diamond trade since 1975. We specialise in low-volume, master-crafted diamond jewellery and heirloom restorations. Our heritage archive spans Hindu, Christian, and Muslim wedding traditions, preserving authentic Kerala designs through unhurried artisanal craftsmanship.</p>
            <h2>A Lineage of Diamond Sourcing</h2>
            <p>Our foundation rests upon decades of profound industry expertise. Before establishing our bespoke maison, our family diamond trade since 1975 supplied leading retailers across the nation. This rich history allows us to bypass commercial supply chains. We procure stones directly from Antwerp, Surat, Mumbai, and Botswana, adhering strictly to Kimberley Process compliant sourcing. Our long-standing relationships ensure that every diamond selected for our bespoke commissions exhibits exceptional brilliance and fire.</p>
            <h2>Master Craftsmanship and Tradition</h2>
            <p>We do not believe in mass manufacturing. Our workshop is anchored by master setters with 15+ years at the bench, working meticulously under a loupe. We rely on the skill of human hands rather than generic setting templates. This dedication allows us to achieve prong tolerances in hundredths of a millimetre, ensuring absolute security for your stones. Discover more about our meticulous approach in our <a href="/methodology">methodology</a>. You can also read more in our journal on <a href="/journal/the-art-of-hand-hammering-and-manual-stone-setting-how-kirthi-diamonds-crafts-jewellery-built-to-last-generations">the art of manual stone setting</a>.</p>
            <h2>Preserving Kerala's Design History</h2>
            <p>Our heritage archive of Kerala designs across Hindu, Christian and Muslim wedding traditions serves as a living library of cultural elegance. Whether crafting a new bridal trousseau or restoring a cherished family piece, our master artisans ensure that historical integrity is maintained. We believe that true luxury is enduring; therefore, heirlooms can be reset, restyled, remade to suit contemporary sensibilities while honouring their past. All our creations are supported by our <a href="/pages/exchange-policy">written lifetime exchange and buyback policy provided with every invoice</a>.</p>
            <p>To explore our archives or discuss a legacy commission, we invite you to <a href="/pages/contact">schedule a consultation with our maison</a>.</p>
          </main>
        </div>
`;

const maisonHtml = `
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>The Maison</h1>
            <p>As a premier luxury diamond house Kerala, Kirthi Diamonds is dedicated to artistic integrity and low-volume craftsmanship. We operate two owned boutiques, not a franchise, ensuring an uncompromised standard of excellence. Our bespoke approach delivers ethically sourced diamonds Kerala, providing a vastly superior setting outcome compared to commercial volume retail.</p>
            <h2>Uncompromising Artistic Integrity</h2>
            <p>We operate on the principle that true luxury cannot be rushed or mass-produced. By limiting our output to select bespoke commissions, we ensure every piece receives the undivided attention of our master artisans. Low volume produces a better setting outcome than volume retail, as each mounting is individually tailored to the precise geometry of the stone. This meticulous process guarantees structural longevity and exceptional optical performance, reflecting our steadfast dedication to the art of fine jewellery.</p>
            <h2>Ethical Sourcing and Provenance</h2>
            <p>We are deeply committed to transparency and sustainability. We provide ethically sourced diamonds Kerala, procuring our stones directly from reputable centres in Antwerp, Surat, Mumbai, and Botswana. Every acquisition adheres to Kimberley Process compliant sourcing, guaranteeing that your jewellery is entirely conflict-free. At our maison, ethical responsibility is inseparable from aesthetic brilliance.</p>
            <h2>Certified Quality Standards</h2>
            <p>Confidence in your acquisition is paramount. At our two owned boutiques, not a franchise, we uphold the strictest industry standards. Every diamond above 0.30ct carries its own individual GIA or IGI certificate, graded to itself not a batch range. Furthermore, all gold BIS Hallmarked 18kt and 22kt ensures absolute purity. For a deeper understanding of our standards, review our <a href="/methodology">methodology</a> and our <a href="/pages/exchange-policy">written lifetime exchange and buyback policy provided with every invoice</a>. Explore our insights on craftsmanship in our <a href="/journal/artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference">journal</a>.</p>
            <p>To experience our commitment to quiet luxury and precision, we welcome you to <a href="/pages/contact">contact our boutiques</a>.</p>
          </main>
        </div>
`;

const bridesHtml = `
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>Bespoke Bridal Jewellery</h1>
            <p>Kirthi Diamonds crafts bespoke bridal jewellery in Kerala, designed to be worn on your wedding day and cherished for generations. We curate diamond, gold, uncut/Polki, and precious stone (ruby, emerald, sapphire) jewellery tailored to Hindu, Christian, and Muslim wedding traditions. We advise initiating bridal commissions 4–8 weeks in advance.</p>
            <h2>Traditions Woven in Gold and Diamonds</h2>
            <p>A wedding trousseau is a profound personal statement and a future family heirloom. We draw upon our heritage archive of Kerala designs across Hindu, Christian and Muslim wedding traditions to create culturally resonant, highly personalized masterpieces. From minimalist modern elegance to intricate classic sets, our bespoke bridal jewellery in Kerala reflects the unique narrative of your union.</p>
            <h2>Polki and Precious Stones</h2>
            <p>Beyond classic diamond suites, we specialize in Polki bridal jewellery Kerala. Our uncut diamond pieces capture an antique, regal aesthetic that pairs beautifully with traditional attire. Our categories include diamond, gold, uncut/Polki, and precious stone (ruby, emerald, sapphire) jewellery. Each piece is meticulously crafted by master artisans to ensure the gems are set securely and beautifully, providing exceptional custom bridal jewellery Kozhikode and Kochi. For a detailed look at our craftsmanship, read our <a href="/journal/artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference">journal on artisanal jewellery</a>.</p>
            <h2>The Commissioning Timeline</h2>
            <p>Creating an heirloom requires time and unhurried precision. We recommend beginning your consultation for full bridal commissions 4–8 weeks prior to your required date, while solitaire mountings 2–3 weeks are standard. This timeline allows our setters to achieve perfect prong tolerances and ensure every detail meets our uncompromising standards outlined in our <a href="/methodology">methodology</a>. Every bridal suite is accompanied by a <a href="/pages/exchange-policy">written lifetime exchange and buyback policy provided with every invoice</a>.</p>
            <p>To begin crafting your bespoke bridal trousseau, please <a href="/pages/contact">reach out to arrange a consultation</a>.</p>
          </main>
        </div>
`;

const jsonLdInjections = `
      // Additional JSON-LD Injections for SEO pages
      if (req.path === '/heritage') {
        const heritageFaq = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How long has Kirthi Diamonds been established?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Kirthi Diamonds is a luxury diamond jeweller in Kochi since 2006. However, our expertise is built upon a continuous family diamond trade since 1975, giving us nearly fifty years of deep industry knowledge and direct sourcing relationships across the globe."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer restoration for vintage or heirloom jewellery?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, heirlooms can be reset, restyled, remade by our master setters. We respect the sentimental value of your pieces and apply our extensive heritage archive of Kerala designs to restore or respectfully modernize your family treasures."
              }
            },
            {
              "@type": "Question",
              "name": "How do you source your diamonds?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We source our stones directly from premier cutting centres in Antwerp, Surat, Mumbai, and Botswana. We maintain strict Kimberley Process compliant sourcing to ensure all materials are ethically procured and entirely conflict-free, preserving both artistic integrity and geological responsibility."
              }
            }
          ]
        };
        const heritageBreadcrumb = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com/" },
            { "@type": "ListItem", "position": 2, "name": "Heritage", "item": "https://kirthidiamonds.com/heritage" }
          ]
        };
        const scriptTag = \`<script type="application/ld+json">\\n\${JSON.stringify(heritageFaq, null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(heritageBreadcrumb, null, 2)}\\n</script>\`;
        indexHtml = indexHtml.replace('</head>', \`\${scriptTag}\\n</head>\`);
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, heritageHtml);
      } else if (req.path === '/maison') {
        const maisonFaq = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is Kirthi Diamonds a franchise?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, we operate exclusively through two owned boutiques, not a franchise. This independent structure allows us to maintain strict artistic integrity, ensuring that every client receives a highly personalized, consultative experience directly from our core team of experts."
              }
            },
            {
              "@type": "Question",
              "name": "Are your diamonds ethically sourced?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. We pride ourselves on providing ethically sourced diamonds Kerala. All our stones are procured through Kimberley Process compliant sourcing from trusted global centres, ensuring they are entirely conflict-free and responsibly mined."
              }
            },
            {
              "@type": "Question",
              "name": "How do you guarantee the quality of your diamonds?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Every diamond above 0.30ct carries its own individual GIA or IGI certificate, graded to itself not a batch range. This guarantees an unbiased, internationally recognized assessment of your stone's cut, clarity, colour, and carat weight."
              }
            }
          ]
        };
        const maisonBreadcrumb = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com/" },
            { "@type": "ListItem", "position": 2, "name": "Maison", "item": "https://kirthidiamonds.com/maison" }
          ]
        };
        const scriptTag = \`<script type="application/ld+json">\\n\${JSON.stringify(maisonFaq, null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(maisonBreadcrumb, null, 2)}\\n</script>\`;
        indexHtml = indexHtml.replace('</head>', \`\${scriptTag}\\n</head>\`);
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, maisonHtml);
      } else if (req.path === '/brides') {
        const bridesFaq = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How far in advance should I order my bespoke bridal jewellery?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For comprehensive bridal suites, we require commissions 4–8 weeks in advance to ensure unhurried, meticulous craftsmanship. If you are exclusively seeking solitaire mountings, we can typically complete the commission within 2–3 weeks."
              }
            },
            {
              "@type": "Question",
              "name": "Do you create jewellery for different cultural traditions?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we utilize our extensive heritage archive of Kerala designs across Hindu, Christian and Muslim wedding traditions. This allows us to craft culturally authentic pieces that honour your specific heritage while reflecting your personal aesthetic."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer uncut diamond or gemstone bridal pieces?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our bespoke offerings include exquisite Polki bridal jewellery Kerala. Our diverse categories include diamond, gold, uncut/Polki, and precious stone (ruby, emerald, sapphire) jewellery, allowing for deeply personalized and vibrant bridal curations."
              }
            },
            {
              "@type": "Question",
              "name": "Is there an exchange policy for bridal purchases?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. True luxury carries certainty, which is why a written lifetime exchange and buyback policy provided with every invoice accompanies all our bridal creations, ensuring your investment is protected for generations."
              }
            }
          ]
        };
        const bridesBreadcrumb = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com/" },
            { "@type": "ListItem", "position": 2, "name": "Brides", "item": "https://kirthidiamonds.com/brides" }
          ]
        };
        const scriptTag = \`<script type="application/ld+json">\\n\${JSON.stringify(bridesFaq, null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(bridesBreadcrumb, null, 2)}\\n</script>\`;
        indexHtml = indexHtml.replace('</head>', \`\${scriptTag}\\n</head>\`);
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, bridesHtml);
      } else if
`;

serverCode = serverCode.replace("if (req.path === '/methodology') {", jsonLdInjections + " (req.path === '/methodology') {");
serverCode = \`
\${serverCode.substring(0, serverCode.indexOf('async function startServer()'))}
const heritageHtml = \`\${heritageHtml}\`;
const maisonHtml = \`\${maisonHtml}\`;
const bridesHtml = \`\${bridesHtml}\`;

\${serverCode.substring(serverCode.indexOf('async function startServer()'))}
\`;

fs.writeFileSync('server.ts', serverCode);
