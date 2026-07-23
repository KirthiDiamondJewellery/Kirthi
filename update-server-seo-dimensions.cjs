const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /newHtml = replaceMetaTag\(newHtml, "property", "og:image:width", "1200"\);\n\s*newHtml = replaceMetaTag\(newHtml, "property", "og:image:height", "630"\);/g;

const replacement = `
            let ogW = "1200";
            let ogH = "630";
            const match = img.match(/_(\\d+)x(\\d+)\\.\\w+$/);
            if (match) {
              ogW = match[1];
              ogH = match[2];
            }
            newHtml = replaceMetaTag(newHtml, "property", "og:image:width", ogW);
            newHtml = replaceMetaTag(newHtml, "property", "og:image:height", ogH);
`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
