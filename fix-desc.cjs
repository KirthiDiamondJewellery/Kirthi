const fs = require('fs');

let appTs = fs.readFileSync('src/App.tsx', 'utf8');

appTs = appTs.replace(
    /let descContent = "A bespoke diamond house/g,
    `let rawDescContent = "A bespoke diamond house`
).replace(
    /descContent = /g,
    `rawDescContent = `
);

// We need to just do a smart replace right before updateSiteSEO:
appTs = appTs.replace(
    /updateSiteSEO\(\{/,
    `
      const descContent = rawDescContent.replace(/\\*\\*/g, '').replace(/<[^>]+>/g, '').trim();
      updateSiteSEO({`
);

fs.writeFileSync('src/App.tsx', appTs);
console.log('Fixed App.tsx descContent');
