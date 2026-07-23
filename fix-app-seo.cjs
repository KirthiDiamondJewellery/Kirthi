const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// The SEO block is from lines 603 to 750 or so. Let's find it.
// We are going to remove the inject... calls and just call updateSiteSEO.
appContent = appContent.replace(
  /import { updateSEO, injectFAQSchema, injectBreadcrumbSchema, injectOrganizationSchema, injectLocalBusinessSchema, injectDynamicArticleSchema } from ".\/utils\/seo";/,
  'import { updateSiteSEO } from "./utils/seo";'
);

// We need to replace the whole updateSEO block and inject... calls.
const seoStart = '      // Update metadata using reusable utility';
const seoEnd = '      // Log SEO Diagnostics to console';

const startIdx = appContent.indexOf(seoStart);
const endIdx = appContent.indexOf(seoEnd);

if (startIdx !== -1 && endIdx !== -1) {
  const newCall = `
      // Update metadata using unified utility
      updateSiteSEO({
        title: targetTitle,
        description: descContent,
        canonicalUrl,
        type: isArticle ? 'article' : 'website',
        publishedTime: articleTime,
        author: articleAuthor,
        image: currentSection?.image || "https://kirthidiamonds.com/logo.png",
        pathname: window.location.pathname,
        blogPosts: content?.blogPosts || [],
        sections: content?.sections || SECTIONS,
        viewMode: viewMode,
        currentSection: currentSection
      });

`;
  appContent = appContent.substring(0, startIdx) + newCall + appContent.substring(endIdx);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Updated App.tsx successfully.");
} else {
  console.log("Could not find SEO block in App.tsx.");
}
