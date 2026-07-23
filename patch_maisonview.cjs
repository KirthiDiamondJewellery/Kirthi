const fs = require('fs');
let code = fs.readFileSync('src/components/MaisonView.tsx', 'utf8');

// Also kochi latitude was not matched, because it's 10.00394 apparently! Let me fix it.
code = code.replace(/"latitude": 10\.00394,/g, '"latitude": 10.006514026736081,');
code = code.replace(/"longitude": 76\.31155/g, '"longitude": 76.31314780185147');

// Fix the OpeningHoursSpecification
code = code.replace(/"openingHoursSpecification": \[\s*\{\s*"@type": "OpeningHoursSpecification",\s*"dayOfWeek": \["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"\],\s*"opens": "10:00",\s*"closes": "20:00"\s*\}\s*\]/g, 
  `"openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "10:00",
                "closes": "20:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": "10:30",
                "closes": "13:00"
              }
            ]`);

fs.writeFileSync('src/components/MaisonView.tsx', code);
