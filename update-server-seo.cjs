const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// 1. Add import
if (!server.includes('generateFAQSchema')) {
  server = server.replace(
    'import { weaveLinks } from "./src/lib/linkWeaver";',
    'import { weaveLinks } from "./src/lib/linkWeaver";\nimport { generateFAQSchema } from "./src/utils/seo";'
  );
}

// 2. Replace the hardcoded block
const blockStart = 'if (slug === "antique-diamond-jewellery-designs-for-traditional-kerala-weddings") {';
const blockEnd = '} else {\n                newHtml = newHtml.replace(\'</head>\', `\\n<script type="application/ld+json">\\n${JSON.stringify(schema)}\\n</script>\\n</head>`);\n              }';

const newBlock = `
              const faqSchema = generateFAQSchema(post.content || '');
              let injection = \`\\n<script type="application/ld+json">\\n\${JSON.stringify(schema)}\\n</script>\`;
              
              if (faqSchema) {
                injection += \`\\n<script type="application/ld+json">\\n\${JSON.stringify(faqSchema)}\\n</script>\`;
              }
              
              newHtml = newHtml.replace('</head>', injection + '\\n</head>');
`;

const startIndex = server.indexOf(blockStart);
const endIndex = server.indexOf(blockEnd) + blockEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  server = server.substring(0, startIndex) + newBlock + server.substring(endIndex);
  fs.writeFileSync('server.ts', server);
  console.log("Successfully replaced block");
} else {
  console.log("Could not find block");
}
