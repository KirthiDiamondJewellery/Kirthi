const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetOgLogic = `
              let img = "https://kirthidiamonds.com/logo.png";
              if (post.image && post.image !== "undefined" && post.image.trim() !== "") {
                img = post.image;
              } else if (post.images && post.images.length > 0 && post.images[0] && post.images[0] !== "undefined" && post.images[0].trim() !== "") {
                img = post.images[0];
              } else if (post.coverImage && post.coverImage !== "undefined" && post.coverImage.trim() !== "") {
                img = post.coverImage;
              }

              if (img) {
                newHtml = replaceMetaTag(newHtml, "property", "og:image", img);
                newHtml = replaceMetaTag(newHtml, "name", "twitter:image", img);
              }
`;

const newOgLogic = `
              let img = post.featuredImage && post.featuredImage.trim() !== "" 
                ? post.featuredImage 
                : "https://kirthidiamonds.com/og-cover.jpg";

              newHtml = replaceMetaTag(newHtml, "property", "og:image", img);
              newHtml = replaceMetaTag(newHtml, "name", "twitter:image", img);
              // Also add explicit width and height numeric tags as required
              newHtml = replaceMetaTag(newHtml, "property", "og:image:width", "1200");
              newHtml = replaceMetaTag(newHtml, "property", "og:image:height", "630");
`;

code = code.replace(targetOgLogic, newOgLogic);

// Also need to inject the metaDescription field
const targetDescLogic = `
              let desc = "Kirthi Diamonds Journal";
              if (post.excerpt && post.excerpt.trim() !== "") {
                desc = post.excerpt;
              } else if (post.content) {
                desc = post.content.replace(/<[^>]*>?/gm, '');
                desc = desc.substring(0, 160) + "...";
              }
`;
const newDescLogic = `
              let desc = "Kirthi Diamonds Journal";
              if (post.metaDescription && post.metaDescription.trim() !== "") {
                desc = post.metaDescription;
              } else if (post.excerpt && post.excerpt.trim() !== "") {
                desc = post.excerpt;
              } else if (post.content) {
                desc = post.content.replace(/<[^>]*>?/gm, '').replace(/\\*\\*/g, '');
                desc = desc.substring(0, 160).trim() + "...";
              }
`;

code = code.replace(targetDescLogic, newDescLogic);
fs.writeFileSync('server.ts', code);
