const fs = require('fs');
let code = fs.readFileSync('src/components/BlogPostView.tsx', 'utf8');

// Replace Article schema
const targetSchema = `        "@type": "Article",
        "headline": post.title,
        "description": postDescription,
        "image": post.featuredImage ? [post.featuredImage] : ["https://kirthidiamonds.com/og-cover.jpg"],
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

const newSchema = `        "@type": "Article",
        "mainEntityOfPage": \`https://kirthidiamonds.com/journal/\${slug}\`,
        "headline": post.title,
        "description": postDescription,
        "image": post.featuredImage ? [post.featuredImage] : ["https://kirthidiamonds.com/og-cover.jpg"],
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
fs.writeFileSync('src/components/BlogPostView.tsx', code);
