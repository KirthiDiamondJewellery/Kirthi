const fs = require('fs');
let content = fs.readFileSync('src/components/SavoirFaire.tsx', 'utf8');

content = content.replace(
  /\{content\.methodologyVideoUrl && \(content\.methodologyVideoUrl\.includes\('youtube'\) \|\| content\.methodologyVideoUrl\.includes\('youtu\.be'\)\) \? \(\s*<VideoFacade videoId=\{content\.methodologyVideoUrl\.match\(\/\(\?:youtu\\\.be\\\/\|youtube\\\.com\\\/\(\?:embed\\\/\|v\\\/\|watch\\\?v=\|watch\\\?\.\+&v=\|shorts\\\/\)\)\(\[\\w-\]\{11\}\)\/i\)\?\.\[1\] \|\| "cGrZrg3_BQw"\} title="Kirthi Diamonds Methodology" \/>\s*\) : \(\s*<VideoFacade videoId="cGrZrg3_BQw" title="Kirthi Diamonds Methodology" \/>\s*\)\}/g,
  '<VideoFacade videoId={videoIdStr} title="Kirthi Diamonds Methodology" />'
);

fs.writeFileSync('src/components/SavoirFaire.tsx', content);
