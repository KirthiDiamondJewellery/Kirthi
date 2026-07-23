const html = `    <meta      property="og:image"      content="https://kirthidiamonds.com/og-cover.jpg"    />`;

const replaceMetaTag = (sourceHtml, attrName, attrValue, newContent) => {
      const metaRegex = /<meta\s+([^>]*?)>/gi;
      let found = false;
      const replaced = sourceHtml.replace(metaRegex, (match, attrs) => {
        const attrRegex = new RegExp(`${attrName}\\s*=\\s*["']?${attrValue}["']?`, 'i');
        if (attrRegex.test(attrs)) {
          found = true;
          const contentRegex = /content\s*=\s*["']?([^"']*)["']?/i;
          if (contentRegex.test(attrs)) {
            const newAttrs = attrs.replace(contentRegex, `content="${newContent}"`);
            return `<meta ${newAttrs}>`;
          }
        }
        return match;
      });
      return replaced;
    };

console.log(replaceMetaTag(html, "property", "og:image", "https://kirthidiamonds.com/journal-cover.jpg"));
