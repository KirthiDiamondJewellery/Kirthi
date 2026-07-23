const fs = require('fs');

let serverTs = fs.readFileSync('server.ts', 'utf8');

const regex = /} else if \(customMeta\[pathPart\]\) \{[\s\S]*?newHtml = newHtml\.replace\(\/<!-- SEO_LINKS_START/;

const replacement = `} else if (customMeta[pathPart]) {
      const meta = customMeta[pathPart];
      newHtml = newHtml.replace(
        /<title>.*?<\\/title>/gi, 
        \`<title>\${meta.title}</title>\`
      );
      newHtml = replaceMetaTag(newHtml, "name", "description", meta.desc);
      newHtml = replaceMetaTag(newHtml, "property", "og:title", meta.title);
      newHtml = replaceMetaTag(newHtml, "property", "og:description", meta.desc);
      newHtml = replaceMetaTag(newHtml, "name", "twitter:title", meta.title);
      newHtml = replaceMetaTag(newHtml, "name", "twitter:description", meta.desc);
      
      const img = meta.image || "https://kirthidiamonds.com/og-cover.jpg";
      newHtml = replaceMetaTag(newHtml, "property", "og:image", img);
      newHtml = replaceMetaTag(newHtml, "name", "twitter:image", img);
      newHtml = replaceMetaTag(newHtml, "property", "og:image:width", "1200");
      newHtml = replaceMetaTag(newHtml, "property", "og:image:height", "630");

      newHtml = newHtml.replace(/<!-- SEO_LINKS_START`;

serverTs = serverTs.replace(regex, replacement);

const regex2 = /"\/journal": \{\s*title: "The Journal \| Kirthi Diamonds",\s*desc: ".*?",\s*fallbackBody: ".*?"\s*\}/;
if (serverTs.includes('"/journal": {')) {
    serverTs = serverTs.replace(
        /"\/journal": \{[\s\S]*?fallbackBody: ".*?"\s*\}/,
        `"/journal": {
        title: "The Journal | Kirthi Diamonds",
        desc: "Insights, artisanal stories, and complete guides to diamond valuation in India.",
        fallbackBody: "<h1>The Journal</h1><p>Insights into artisanal diamond jewellery and investment grade solitaires.</p>",
        image: "https://kirthidiamonds.com/journal-cover.jpg"
      }`
    );
} else {
    serverTs = serverTs.replace(
        /"\/maison": \{/,
        `"/journal": {
        title: "The Journal | Kirthi Diamonds",
        desc: "Insights, artisanal stories, and complete guides to diamond valuation in India.",
        fallbackBody: "<h1>The Journal</h1><p>Insights into artisanal diamond jewellery and investment grade solitaires.</p>",
        image: "https://kirthidiamonds.com/journal-cover.jpg"
      },
      "/maison": {`
    );
}

fs.writeFileSync('server.ts', serverTs);
console.log('Fixed customMeta og:image successfully');
