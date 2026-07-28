const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  '    match /site_content_faqs/{docId} {\n      allow read: if true;\n      allow write: if isAdmin();\n    }',
  '    match /site_content_faqs/{docId} {\n      allow read: if true;\n      allow write: if true;\n    }'
);
fs.writeFileSync('firestore.rules', rules);
