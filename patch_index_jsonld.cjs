const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
// Add Sunday closed for Kochi
content = content.replace(
  '"Saturday"\n          ],\n          "opens": "10:00",\n          "closes": "19:00"\n        }\n      ]',
  '"Saturday"\n          ],\n          "opens": "10:00",\n          "closes": "19:00"\n        },\n        {\n          "@type": "OpeningHoursSpecification",\n          "dayOfWeek": "Sunday",\n          "opens": "00:00",\n          "closes": "00:00"\n        }\n      ]'
);
// Add Sunday closed for Calicut
content = content.replace(
  '"Saturday"\n          ],\n          "opens": "09:30",\n          "closes": "19:30"\n        }\n      ]',
  '"Saturday"\n          ],\n          "opens": "09:30",\n          "closes": "19:30"\n        },\n        {\n          "@type": "OpeningHoursSpecification",\n          "dayOfWeek": "Sunday",\n          "opens": "00:00",\n          "closes": "00:00"\n        }\n      ]'
);
fs.writeFileSync('index.html', content);
