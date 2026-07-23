const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const MemoizedJournalView = memo\(JournalView\);/g, 'const MemoizedJournalView = JournalView;');
fs.writeFileSync('src/App.tsx', code);
