const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /onContact=\{\(\) => setCurrentSection\(SECTIONS\.find\(s => s\.id === "contact"\)!\)\}/,
  "onContact={handleInquiry}"
);

content = content.replace(
  /onGoHome=\{\(\) => setCurrentSection\(SECTIONS\[0\]\)\}/,
  "onGoHome={handleGoHome}"
);

fs.writeFileSync('src/App.tsx', content);
