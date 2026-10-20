const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const startStr = 'Philosophy Subtitle (use \\n';
const endStr = 'for line breaks)</label>';
const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx + startStr.length) + content.substring(endIdx);
  fs.writeFileSync('src/components/AdminView.tsx', content);
  console.log("Fixed!");
} else {
  console.log("Not found.");
}
