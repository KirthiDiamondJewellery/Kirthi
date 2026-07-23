const fs = require('fs');

let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

content = content.replace(
  'metaDescription: "Kerala wedding diamond jewellery traditions explained — exploring heritage designs like Mullamottu Mala, Palakka Mala, and Lakshmi Haram for the modern bride."',
  'metaDescription: "Kerala wedding diamond jewellery traditions: exploring heritage designs like Mullamottu Mala, Palakka Mala, and Lakshmi Haram for the modern bride."'
);

// Check if any "concierge" or "private viewing" is in server.ts or ContentContext.tsx
const hasConciergeContent = content.toLowerCase().includes('concierge');
const hasPrivateContent = content.toLowerCase().includes('private viewing');
console.log('ContentContext has concierge:', hasConciergeContent, 'private viewing:', hasPrivateContent);

let server = fs.readFileSync('server.ts', 'utf8');
const hasConciergeServer = server.toLowerCase().includes('concierge');
const hasPrivateServer = server.toLowerCase().includes('private viewing');
console.log('Server has concierge:', hasConciergeServer, 'private viewing:', hasPrivateServer);

fs.writeFileSync('src/contexts/ContentContext.tsx', content);

