const fs = require('fs');

let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');
let match;
const regex = /metaDescription:\s*"([^"]+)"/g;
while ((match = regex.exec(content)) !== null) {
  if (match[1].length > 160) {
    console.log(`[ContentContext] Too long (${match[1].length}):`, match[1]);
  }
}

let server = fs.readFileSync('server.ts', 'utf8');
const descRegex = /desc:\s*"([^"]+)"/g;
while ((match = descRegex.exec(server)) !== null) {
  if (match[1].length > 160) {
    console.log(`[Server desc] Too long (${match[1].length}):`, match[1]);
  }
}

const titleRegex = /title:\s*"([^"]+)"/g;
while ((match = titleRegex.exec(server)) !== null) {
  if (match[1].length > 60) {
    console.log(`[Server title] Too long (${match[1].length}):`, match[1]);
  }
}

