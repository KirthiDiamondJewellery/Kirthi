const fs = require('fs');
let content = fs.readFileSync('src/components/LandingView.tsx', 'utf8');

// The first h1 is correct, the rest should be h2
let matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/g);
if (matches && matches.length > 0) {
  for (let i = 1; i < matches.length; i++) {
    let replaced = matches[i].replace('<h1', '<h2').replace('</h1>', '</h2>');
    content = content.replace(matches[i], replaced);
  }
}

fs.writeFileSync('src/components/LandingView.tsx', content);
