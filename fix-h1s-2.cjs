const fs = require('fs');

function replaceH2WithH1(filePath, searchString) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchString, (match) => {
    return match.replace(/<h[23]/, '<h1').replace(/<\/h[23]>/, '</h1>');
  });
  fs.writeFileSync(filePath, content);
}

replaceH2WithH1('src/components/BridesShowcase.tsx', /<h2([^>]*)>Bespoke Bridal Jewellery, Made to Be Inherited<\/h2>/);

// Check LandingView
console.log(fs.readFileSync('src/components/LandingView.tsx', 'utf8').match(/<h[123][^>]*>.*?<\/h[123]>/g));

