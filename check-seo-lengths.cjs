const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

const descRegex = /desc:\s*"([^"]+)"/g;
let match;
while ((match = descRegex.exec(server)) !== null) {
  if (match[1].length > 155) {
    console.log(`[Server desc] Too long (${match[1].length}):`, match[1]);
  }
}

const titleRegex = /title:\s*"([^"]+)"/g;
while ((match = titleRegex.exec(server)) !== null) {
  if (match[1].length > 60) {
    console.log(`[Server title] Too long (${match[1].length}):`, match[1]);
  }
}

const metaDescRegex = /metaDescription:\s*"([^"]+)"/g;
while ((match = metaDescRegex.exec(content)) !== null) {
  if (match[1].length > 155) {
    console.log(`[ContentContext metaDescription] Too long (${match[1].length}):`, match[1]);
  }
}

