const fs = require('fs');
let content = fs.readFileSync('src/components/FAQView.tsx', 'utf8');

const endOfCorrectLoop = '          })}';
const startOfCorrectA = '        <a href="/"';
const part1 = content.split(endOfCorrectLoop)[0] + endOfCorrectLoop + '\n        </div>\n';
const part2 = startOfCorrectA + content.split(startOfCorrectA)[1];
fs.writeFileSync('src/components/FAQView.tsx', part1 + part2, 'utf8');
