const fs = require('fs');
let appTs = fs.readFileSync('src/App.tsx', 'utf8');

appTs = appTs.replace(
    /image: \(viewMode === 'blog'[\s\S]*?\),/,
    `image: (viewMode === 'blog' && window.location.pathname.startsWith('/journal/') && window.location.pathname !== '/journal') 
            ? ((content?.blogPosts?.find(p => p.id === window.location.pathname.replace('/journal/', ''))?.image || content?.blogPosts?.find(p => p.id === window.location.pathname.replace('/journal/', ''))?.featuredImage) || "https://kirthidiamonds.com/og-cover.jpg")
            : (window.location.pathname === '/journal' ? "https://kirthidiamonds.com/journal-cover.jpg" : "https://kirthidiamonds.com/og-cover.jpg"),`
);

fs.writeFileSync('src/App.tsx', appTs);
