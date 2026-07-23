const fs = require('fs');

let appTs = fs.readFileSync('src/App.tsx', 'utf8');

// Find the seo config object inside updateSiteSEO call
appTs = appTs.replace(
    /image: currentSection\?\.image \|\| "https:\/\/kirthidiamonds\.com\/logo\.png",/,
    `image: (viewMode === 'blog' && window.location.pathname.startsWith('/journal/') && window.location.pathname !== '/journal') 
            ? (content?.blogPosts?.find(p => p.id === window.location.pathname.replace('/journal/', ''))?.featuredImage || "https://kirthidiamonds.com/og-cover.jpg")
            : (window.location.pathname === '/journal' ? "https://kirthidiamonds.com/journal-cover.jpg" : "https://kirthidiamonds.com/og-cover.jpg"),`
);

fs.writeFileSync('src/App.tsx', appTs);
console.log('Fixed App.tsx og:image successfully');
