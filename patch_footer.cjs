const fs = require('fs');
let content = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');
content = content.replace('"name": "Kirthi Diamonds — Calicut",\n            "image": "https://kirthidiamonds.com/og-cover.jpg",\n            "url": "https://kirthidiamonds.com/",\n            "telephone": "+919847086990"', '"name": "Kirthi Diamonds — Calicut",\n            "image": "https://kirthidiamonds.com/og-cover.jpg",\n            "url": "https://kirthidiamonds.com/",\n            "telephone": "+919847086002"');
// replace the UI phone number
content = content.replace('<span>Calicut</span>\n              <a\n                href="tel:+919847086990"', '<span>Calicut</span>\n              <a\n                href="tel:+919847086002"');
content = content.replace('className="hover:text-white transition-colors block text-xs underline underline-offset-4"\n              >\n                <span>+91 98470 86990</span>\n              </a>\n            </div>\n          </div>', 'className="hover:text-white transition-colors block text-xs underline underline-offset-4"\n              >\n                <span>+91 98470 86002</span>\n              </a>\n            </div>\n          </div>');

fs.writeFileSync('src/components/SharedFooter.tsx', content);
