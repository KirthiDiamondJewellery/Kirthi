const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const targetStr = `newHtml = newHtml.replace('</head>', \`\\n<script type="application/ld+json">\\n\${JSON.stringify(schema, null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(breadcrumbSchema, null, 2)}\\n</script>\\n</head>\`);`;

const replacementStr = `const dynamicFaqSchema = generateFAQSchema(post.content || '');
            const faqScript = dynamicFaqSchema ? \`\\n<script type="application/ld+json">\\n\${JSON.stringify(dynamicFaqSchema, null, 2)}\\n</script>\` : '';
            newHtml = newHtml.replace('</head>', \`\\n<script type="application/ld+json">\\n\${JSON.stringify(schema, null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(breadcrumbSchema, null, 2)}\\n</script>\${faqScript}\\n</head>\`);`;

serverTs = serverTs.replace(targetStr, replacementStr);
fs.writeFileSync('server.ts', serverTs);
