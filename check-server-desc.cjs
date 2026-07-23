const fs = require('fs');
const server = fs.readFileSync('server.ts', 'utf8');

const descRegex = /desc:\s*"([^"]+)"/g;
let match;
while ((match = descRegex.exec(server)) !== null) {
  if (match[1].length > 155) {
    console.log(`[Server desc] Too long (${match[1].length}):`, match[1]);
  }
}
