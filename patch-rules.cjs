const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const target = 'match /bridalSubmissions/{submissionId} {';
const replacement = `match /faq_feedback/{docId} {
      allow create: if true;
      allow read: if isAdmin();
      allow delete: if isAdmin();
    }
    
    match /bridalSubmissions/{submissionId} {`;

content = content.replace(target, replacement);
fs.writeFileSync('firestore.rules', content, 'utf8');
console.log('firestore.rules updated');
