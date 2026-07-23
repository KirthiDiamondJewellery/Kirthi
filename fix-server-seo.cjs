const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// The replacement should happen around where the hardcoded FAQ schemas are
const hardcodedFaqStart = 'if (slug === "antique-diamond-jewellery-designs-for-traditional-kerala-weddings") {';

// First, let's just find the entire block of if-else that injects FAQ schema.
// It is between `newHtml = newHtml.replace(` and `} else {`
// Let's just use string replace.
