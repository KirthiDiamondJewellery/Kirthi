const fs = require('fs');
let code = fs.readFileSync('src/lib/linkWeaver.ts', 'utf8');

code = code.replace(/newContent = newContent\.replace\(\/\\\*\\\*\\s\+\(\.\*\?\)\\s\+\\\*\\\*\/g, "\\*\\*\\$1\\*\\*"\);/, 
  `newContent = newContent.replace(/\\*\\*\\s+(.*?)\\s+\\*\\*/g, "**$1**");\n  newContent = newContent.replace(/\\*\\*\\*(.*?)\\*\\*/g, "* **$1**");`);

fs.writeFileSync('src/lib/linkWeaver.ts', code);
