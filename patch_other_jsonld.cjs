const fs = require('fs');

// MaisonView
let content = fs.readFileSync('src/components/MaisonView.tsx', 'utf8');
content = content.replace(
  '"opens": "10:00",\n                "closes": "19:00"\n              }\n            ]',
  '"opens": "10:00",\n                "closes": "19:00"\n              },\n              {\n                "@type": "OpeningHoursSpecification",\n                "dayOfWeek": "Sunday",\n                "opens": "00:00",\n                "closes": "00:00"\n              }\n            ]'
);
content = content.replace(
  '"opens": "09:30",\n                "closes": "19:30"\n              }\n            ]',
  '"opens": "09:30",\n                "closes": "19:30"\n              },\n              {\n                "@type": "OpeningHoursSpecification",\n                "dayOfWeek": "Sunday",\n                "opens": "00:00",\n                "closes": "00:00"\n              }\n            ]'
);
fs.writeFileSync('src/components/MaisonView.tsx', content);

// SharedFooter
let footer = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');
footer = footer.replace(
  '"opens": "10:00", "closes": "19:00"\n            }]',
  '"opens": "10:00", "closes": "19:00"\n            }, {\n              "@type": "OpeningHoursSpecification",\n              "dayOfWeek": "Sunday",\n              "opens": "00:00", "closes": "00:00"\n            }]'
);
footer = footer.replace(
  '"opens": "09:30", "closes": "19:30"\n            }]',
  '"opens": "09:30", "closes": "19:30"\n            }, {\n              "@type": "OpeningHoursSpecification",\n              "dayOfWeek": "Sunday",\n              "opens": "00:00", "closes": "00:00"\n            }]'
);
fs.writeFileSync('src/components/SharedFooter.tsx', footer);

