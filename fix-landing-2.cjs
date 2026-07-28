const fs = require('fs');
let content = fs.readFileSync('src/components/LandingView.tsx', 'utf8');

// The Pillars of Trust
content = content.replace(
  `<h2 className="text-4xl md:text-5xl font-serif italic text-white/90">
              The Pillars of Trust
            </h1>`,
  `<h2 className="text-4xl md:text-5xl font-serif italic text-white/90">
              The Pillars of Trust
            </h2>`
);

// Any other mismatch
content = content.replace(/<h2([^>]*)>([^<]*)<\/h1>/g, '<h2$1>$2</h2>');

fs.writeFileSync('src/components/LandingView.tsx', content);
